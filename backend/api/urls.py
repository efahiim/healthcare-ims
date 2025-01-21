from django.urls import path
from .views import (
    UserRegistrationView, UserLoginView, UserLogoutView, MedicalStaffRegistrationView, 
    PatientRegistrationView, ImageListCreateView, InvoiceDetailView, DiagnosticReportView, 
    PaymentListCreateView
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
]
