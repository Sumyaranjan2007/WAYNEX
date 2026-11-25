"""
Core models for WAYNEX.
BaseModel provides UUID primary key, timestamps, and soft delete for all models.
"""
import uuid

from django.db import models


class BaseModelQuerySet(models.QuerySet):
    """Custom queryset that filters out soft-deleted objects by default."""

    def active(self):
        return self.filter(is_active=True)

    def inactive(self):
        return self.filter(is_active=False)


class BaseModelManager(models.Manager):
    """Custom manager that uses BaseModelQuerySet."""

    def get_queryset(self):
        return BaseModelQuerySet(self.model, using=self._db)

    def active(self):
        return self.get_queryset().active()

    def inactive(self):
        return self.get_queryset().inactive()


class BaseModel(models.Model):
    """
    Abstract base model for all WAYNEX models.
    Provides UUID primary key, timestamps, and soft delete.
    """
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text='Unique identifier for this record.',
    )
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True, db_index=True)

    objects = BaseModelManager()

    class Meta:
        abstract = True
        ordering = ['-created_at']

    def soft_delete(self):
        """Mark this record as inactive instead of deleting."""
        self.is_active = False
        self.save(update_fields=['is_active', 'updated_at'])

    def restore(self):
        """Restore a soft-deleted record."""
        self.is_active = True
        self.save(update_fields=['is_active', 'updated_at'])
