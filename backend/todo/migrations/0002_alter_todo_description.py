# Generated by Django 3.2.6 on 2022-04-01 23:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='todo',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
    ]