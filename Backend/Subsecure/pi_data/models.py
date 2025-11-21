from django.db import models
from django.utils import timezone


class NodeData(models.Model):
    timestamp = models.DateTimeField(default=timezone.now)
    node_id = models.CharField(max_length=3)

    temperature = models.IntegerField(default=0)
    humidity = models.IntegerField(default=0)
    pm25 = models.IntegerField(default=0)

    worker_state = models.IntegerField(default=0)     # 0 = fine, 1 = alert
    worker_presence = models.IntegerField(default=0)  # 0 = not present, 1 = present

    class Meta:
        ordering = ["-timestamp"]

    def __str__(self):
        return f"Node {self.node_id} @ {self.timestamp}"
