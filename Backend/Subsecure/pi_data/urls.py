from django.urls import path
from .views import Node,NodeHist

urlpatterns = [
    path('nodeData/', Node.as_view(), name='Node'),
    path('nodeData/<str:node_id>/', Node.as_view(), name='node-detail'),
    path('nodeHistory/', NodeHist.as_view(), name='NodeHistory'),
] 