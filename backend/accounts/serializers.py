
from django.contrib.auth import get_user_model
from django.db import transaction

from rest_framework import serializers

from members.models import Members

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    phone = serializers.CharField(max_length=15,write_only=True)
    address = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'password',
            'phone',
            'address'
        ]

    @transaction.atomic
    def create(self, validated_data):

        phone = validated_data.pop('phone')
        address = validated_data.pop('address')

        validated_data['role'] = User.Role.MEMBER

        user = User.objects.create_user(
            **validated_data
        )

        Members.objects.create(
            user=user,
            phone=phone,
            address=address
        )

        return user
