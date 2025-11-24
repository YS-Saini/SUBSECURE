from rest_framework import serializers
from .models import NodeData,NodeHistory

class NodeDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = NodeData
        fields = ['timestamp', 'node_id', 'temperature', 'humidity', 'pm25', 'worker_state', 'worker_presence']

class NodeHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = NodeHistory
        fields = ['id','timestamp', 'node_id', 'temperature', 'humidity', 'pm25', 'worker_state', 'worker_presence']