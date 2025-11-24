from django.shortcuts import render
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from .models import NodeData,NodeHistory
from .serializers import NodeDataSerializer,NodeHistorySerializer

# Create your views here.
class Node(APIView):
    def get(self,request=None):
        data=NodeData.objects.all()
        serializer=NodeDataSerializer(data,many=True)
        return Response(serializer.data,status=200)
    
    def put(self, request, node_id):
        """
        Update the NodeData instance based on node_id.
        """
        node = get_object_or_404(NodeData, pk=node_id) 
        serializer = NodeDataSerializer(node, data=request.data, partial=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, node_id):
        """
        Partial update of NodeData instance based on node_id.
        """
        node = get_object_or_404(NodeData, pk=node_id)
        serializer = NodeDataSerializer(node, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class NodeHist(APIView):
    def get(self,request=None):
        data=NodeHistory.objects.all()
        serializer=NodeHistorySerializer(data,many=True)
        return Response(serializer.data,status=200)
    
    def post(self, request):
        """
        Create a new NodeHistory entry.
        """
        serializer = NodeHistorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


