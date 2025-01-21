from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_ADMINISTRATOR = 'administrator'
    ROLE_MEDICAL_STAFF = 'medicalStaff'
    ROLE_PATIENT = 'patient'
    
    ROLE_CHOICES = (
        (ROLE_ADMINISTRATOR, 'Administrator'),
        (ROLE_MEDICAL_STAFF, 'Medical Staff'),
        (ROLE_PATIENT, 'Patient'),
    )

    role = models.CharField(max_length=15, choices=ROLE_CHOICES)
    
class MedicalStaff(models.Model):
    ROLE_DOCTOR = 'doctor'
    ROLE_RADIOLOGIST = 'radiologist'

    ROLE_CHOICES = (
        (ROLE_DOCTOR, 'Doctor'),
        (ROLE_RADIOLOGIST, 'Radiologist'),
    )

    EMPLOYEE_ACTIVE = 'active'
    EMPLOYEE_RETIRED = 'retired'

    EMPLOYEE_STATUS_CHOICES = (
        (EMPLOYEE_ACTIVE, 'Active'),
        (EMPLOYEE_RETIRED, 'Retired'),
    )

    staff_id = models.AutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="medical_staff_account")
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES)
    contact_info = models.TextField()
    employee_status = models.CharField(max_length=20, choices=EMPLOYEE_STATUS_CHOICES)
    
class Patient(models.Model):
    patient_id = models.AutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="patient_account")
    name = models.CharField(max_length=100)
    address = models.TextField()
    date_of_birth = models.DateField()
    diagnosis = models.TextField(blank=True, null=True)
    diagnosis_date = models.DateField()
    conditions = models.TextField(blank=True, null=True)
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    
class Image(models.Model):
    image_id = models.AutoField(primary_key=True)
    type = models.CharField(max_length=50)
    timestamp = models.DateTimeField(auto_now_add=True)
    classification = models.CharField(max_length=100)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='images')

class Invoice(models.Model):
    invoice_id = models.AutoField(primary_key=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    date_issued = models.DateField(auto_now_add=True)
    patient = models.OneToOneField(Patient, on_delete=models.CASCADE, related_name='invoice')

class DiagnosticReport(models.Model):
    report_id = models.AutoField(primary_key=True)
    report_date = models.DateField(auto_now_add=True)
    diagnosis = models.TextField()
    medical_staff = models.ForeignKey(MedicalStaff, on_delete=models.CASCADE, related_name='reports')
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='reports')
    images = models.ManyToManyField(Image, related_name='reports')

class Payment(models.Model):
    PAYMENT_CARD = 'card'
    PAYMENT_CASH = 'cash'

    PAYMENT_CHOICES = (
        (PAYMENT_CARD, 'Debit/Credit Card'),
        (PAYMENT_CASH, 'Cash'),
    )
    
    payment_id = models.AutoField(primary_key=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateField(auto_now_add=True)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_CHOICES)
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='payments')