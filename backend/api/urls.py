from django.urls import path
from .views import (
    UserRegistrationView, UserLoginView, UserLogoutView, MedicalStaffRegistrationView, 
    PatientRegistrationView, ImageUploadView, InvoiceDetailView, DiagnosticReportView, 
    PaymentDetailView, UserListView, PatientListView, InvoiceListView, MedicalStaffListView
)

urlpatterns = [
    path('auth/register/', UserRegistrationView.as_view(), name='user-registration'),
    path('auth/login/', UserLoginView.as_view(), name='user-login'),
    path('auth/logout/', UserLogoutView.as_view(), name='user-logout'),
    path('auth/register/medical-staff/', MedicalStaffRegistrationView.as_view(), name='medical-staff-registration'),
    path('auth/register/patient/', PatientRegistrationView.as_view(), name='patient-registration'),
    path('images/', ImageUploadView.as_view(), name='upload-image'),
    path('reports/', DiagnosticReportView.as_view(), name='create-report'),
    path('reports/<int:patient_id>/', DiagnosticReportView.as_view(), name='get-reports'),
    path('invoices/<int:patient_id>/', InvoiceDetailView.as_view(), name='invoice-detail'),
    path('reports/<int:patient_id>/', DiagnosticReportView.as_view(), name='report-list-create'),
    path('payment/<int:invoice_id>/', PaymentDetailView.as_view(), name='payment-detail'),
    path("users/", UserListView.as_view(), name="user-list"),
    path("medical-staff/", MedicalStaffListView.as_view(), name="medical-staff-list"),
    path('medical-staff/<int:staff_id>/', MedicalStaffListView.as_view(), name="medical-staff-list-id"),
    path("patients/", PatientListView.as_view(), name="patient-list"),
    path('patients/<int:patient_id>/', PatientListView.as_view(), name="patient-list-id"),
    path("invoices/", InvoiceListView.as_view(), name="invoice-list"),
]
