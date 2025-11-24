import json
import signal
import sys
import paho.mqtt.client as mqtt
from django.core.management.base import BaseCommand
from decouple import config
from django.utils import timezone

from pi_data.models import NodeData,NodeHistory

MQTT_TOPIC = config("MQTT_TOPIC", default="subsecure/data")


def parse_node_string(segment):
    """Parses a single 11-character node string."""
    node_id = segment[0:3]
    temp = int(segment[3:5])
    humidity = int(segment[5:7])
    pm25 = int(segment[7:9])
    worker_state = int(segment[9])
    worker_presence = int(segment[10])

    return {
        "node_id": node_id,
        "temperature": temp,
        "humidity": humidity,
        "pm25": pm25,
        "worker_state": worker_state,
        "worker_presence": worker_presence,
    }


class Command(BaseCommand):
    help = "MQTT Listener for Pi node stream"

    def handle(self, *args, **kwargs):

        def on_connect(client, userdata, flags, rc, properties=None):
            if rc == 0:
                self.stdout.write(self.style.SUCCESS("Connected to MQTT broker"))
                client.subscribe(MQTT_TOPIC)
                self.stdout.write(self.style.SUCCESS(f"Subscribed → {MQTT_TOPIC}"))
            else:
                self.stdout.write(self.style.ERROR(f"Connect failed rc={rc}"))

        def on_message(client, userdata, msg):
            try:
                raw = msg.payload.decode().strip()
                segments = raw.split(",")

                timestamp = timezone.now()

                for seg in segments:
                    if len(seg) != 11:
                        self.stdout.write(self.style.ERROR(f"Invalid segment: {seg}"))
                        continue

                    data = parse_node_string(seg)

                    NodeData.objects.update_or_create(
                        node_id=data["node_id"],  # Use node_id as the unique key
                        defaults={
                            'timestamp': timestamp,
                            'temperature': data["temperature"],
                            'humidity': data["humidity"],
                            'pm25': data["pm25"],
                            'worker_state': data["worker_state"],
                            'worker_presence': data["worker_presence"],
                        }
                    )

                    NodeHistory.objects.create(
                        timestamp=timestamp,
                        node_id=data["node_id"],
                        temperature=data["temperature"],
                        humidity=data["humidity"],
                        pm25=data["pm25"],
                        worker_state=data["worker_state"],
                        worker_presence=data["worker_presence"],
                    )

                self.stdout.write(self.style.SUCCESS(f"Stored data for {len(segments)} nodes"))

            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Error: {e}"))

        def stop_handler(sig, frame):
            self.stdout.write(self.style.WARNING("Stopping MQTT listener..."))
            client.disconnect()
            client.loop_stop()
            sys.exit(0)

        signal.signal(signal.SIGINT, stop_handler)

        broker = config("MQTT_BROKER", default="broker.hivemq.com")
        port = int(config("MQTT_PORT", default=1883))

        client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
        client.on_connect = on_connect
        client.on_message = on_message

        self.stdout.write(self.style.WARNING(f"Connecting to {broker}:{port}"))
        client.connect(broker, port, 60)
        client.loop_forever()
