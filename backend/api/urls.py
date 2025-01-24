from django.urls import path
from .views import (
    UserRegistrationView, UserLoginView, UserLogoutView, MedicalStaffRegistrationView, 
    PatientRegistrationView, ImageListCreateView, InvoiceDetailView, DiagnosticReportView, 
    PaymentListCreateView, UserListView, PatientListView, InvoiceListView, MedicalStaffListView
)

urlpatterns = [
    path('auth/register/', UserRegistrationView.as_view(), name='user-registration'),
    path('auth/login/', UserLoginView.as_view(), name='user-login'),
    path('auth/logout/', UserLogoutView.as_view(), name='user-logout'),
    path('auth/register/medical-staff/', MedicalStaffRegistrationView.as_view(), name='medical-staff-registration'),
    path('auth/register/patient/', PatientRegistrationView.as_view(), name='patient-registration'),
    path('images/', ImageListCreateView.as_view(), name='image-list-create'),
    path('invoices/<int:patient_id>/', InvoiceDetailView.as_view(), name='invoice-detail'),
    path('reports/<int:patient_id>/', DiagnosticReportView.as_view(), name='report-list-create'),
    path('payments/<int:invoice_id>/', PaymentListCreateView.as_view(), name='payment-list-create'),
    path("users/", UserListView.as_view(), name="user-list"),
    path("medical-staff/", MedicalStaffListView.as_view(), name="medical-staff-list"),
    path('medical-staff/<int:staff_id>/', MedicalStaffListView.as_view(), name="medical-staff-list-id"),
    path("patients/", PatientListView.as_view(), name="patient-list"),
    path('patients/<int:patient_id>/', PatientListView.as_view(), name="patient-list-id"),
    path("invoices/", InvoiceListView.as_view(), name="invoice-list"),
]
