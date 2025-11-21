from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import NodeData


@admin.register(NodeData)
class NodeDataAdmin(ModelAdmin):
    list_display = (
        "timestamp", "node_id", "temperature",
        "humidity", "pm25", "worker_state", "worker_presence"
    )
    list_filter = ("node_id", "worker_state", "worker_presence", "timestamp")
    search_fields = ("node_id",)
