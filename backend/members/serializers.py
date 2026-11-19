
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Members

User = get_user_model()


class MemberSerializer(serializers.ModelSerializer):

    username = serializers.CharField(source='user.username')
    email = serializers.EmailField(source='user.email')
    password = serializers.CharField(
        write_only=True,
        required=False,
        min_length=8
    )

    class Meta:
        model = Members
        fields = [
            'id',
            'username',
            'email',
            'password',
            'phone',
            'address',
            'joined_date',
        ]
        read_only_fields = ['id', 'joined_date']

    def validate(self, attrs):
        if self.instance is None and not attrs.get('password'):
            raise serializers.ValidationError({
                'password': 'Password is required when creating a member.'
            })
        return attrs

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        password = validated_data.pop('password')

        user = User.objects.create_user(
            username=user_data['username'],
            email=user_data['email'],
            password=password,
            role=User.Role.MEMBER
        )

        member = Members.objects.create(
            user=user,
            **validated_data
        )

        return member

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        password = validated_data.pop('password', None)

        instance.user.username = user_data.get(
            'username', instance.user.username
        )
        instance.user.email = user_data.get(
            'email', instance.user.email
        )

        if password:
            instance.user.set_password(password)

        instance.user.save()

        for field, value in validated_data.items():
            setattr(instance, field, value)

        instance.save()
        return instance
