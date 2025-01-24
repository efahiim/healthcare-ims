from .serializers import UserSerializer, MedicalStaffSerializer, PatientSerializer
from django.contrib.auth import authenticate, login
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny
from .permissions import IsAdmin, IsMedicalStaff, IsPatient
from .models import Image, Invoice, DiagnosticReport, Payment, User, MedicalStaff, Patient
from .serializers import ImageSerializer, InvoiceSerializer, DiagnosticReportSerializer, PaymentSerializer

class UserRegistrationView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class MedicalStaffRegistrationView(APIView):
    permission_classes = [IsAdmin]
    
    def post(self, request):
        serializer = MedicalStaffSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PatientRegistrationView(APIView):
    permission_classes = [IsAdmin | IsMedicalStaff]
    
    def post(self, request):
        serializer = PatientSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        # Authenticate user
        user = authenticate(request, username=username, password=password)
        if user is not None:
            # Log the user in
            login(request, user)
            
            # Delete any existing token for the user
            Token.objects.filter(user=user).delete()
            
            # Create a new token
            token = Token.objects.create(user=user)
            
            response_data = {
                'token': token.key,
                'id': user.id,
                'username': user.username,
                'role': user.role,
            }

            # Include additional data for specific roles
            if user.role == 'medicalStaff':
                medical_staff = user.medical_staff_account
                if medical_staff is not None:
                    medical_staff_data = MedicalStaffSerializer(medical_staff).data
                    response_data['data'] = medical_staff_data
            
            if user.role == 'patient':
                patient = user.patient_account
                if patient is not None:
                    patient_data = PatientSerializer(patient).data
                    response_data['data'] = patient_data

            return Response(response_data, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)

class UserLogoutView(APIView):
    def post(self, request, *args, **kwargs):
        # Extract the token from the request header
        token_key = request.auth.key if request.auth else None
        
        if not token_key:
            return Response({'message': 'Token is missing or invalid'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Attempt to retrieve and delete the token
            token = Token.objects.get(key=token_key)
            token.delete()
            return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)
        except Token.DoesNotExist:
            # Handle case where token does not exist
            return Response({'message': 'Token does not exist or is already invalidated'}, status=status.HTTP_400_BAD_REQUEST)

class ImageUploadView(APIView):
    permission_classes = [IsAdmin | IsMedicalStaff | IsPatient]

    def get(self, request):
        patient_id = request.query_params.get('patient_id', None)
        if patient_id:
            images = Image.objects.filter(patient_id=patient_id)
        else:
            images = Image.objects.all()

        serializer = ImageSerializer(images, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class InvoiceDetailView(APIView):
    permission_classes = [IsAdmin | IsMedicalStaff | IsPatient]

    def get(self, request, patient_id):
        invoices = Invoice.objects.filter(patient_id=patient_id)
        if invoices.exists():
            serializer = InvoiceSerializer(invoices, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'error': 'No invoices found for this patient'}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, patient_id):
        data = request.data.copy()
        data['patient'] = patient_id 
        
        serializer = InvoiceSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DiagnosticReportView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = DiagnosticReportSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, patient_id):
        reports = DiagnosticReport.objects.filter(patient_id=patient_id)
        serializer = DiagnosticReportSerializer(reports, many=True)
        return Response(serializer.data)

class PaymentDetailView(APIView):
    permission_classes = [IsAdmin | IsMedicalStaff | IsPatient]

    def get(self, request, invoice_id):
        try:
            payment = Payment.objects.get(invoice_id=invoice_id)
            serializer = PaymentSerializer(payment)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Payment.DoesNotExist:
            return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)
    
class UserListView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        users = User.objects.all()
        data = [{"username": user.username, "email": user.email, "role": user.role} for user in users]
        return Response(data)

class MedicalStaffListView(APIView):
    permission_classes = [IsAdmin | IsMedicalStaff | IsPatient]

    def get(self, request, staff_id=None):
        if staff_id:
            try:
                staff = MedicalStaff.objects.get(pk=staff_id)
            except MedicalStaff.DoesNotExist:
                return Response({"error": "Medical staff not found."}, status=status.HTTP_404_NOT_FOUND)

            serializer = MedicalStaffSerializer(staff)
            return Response(serializer.data, status=status.HTTP_200_OK)

        staff = MedicalStaff.objects.all()
        serializer = MedicalStaffSerializer(staff, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, staff_id):
        try:
            staff = MedicalStaff.objects.get(pk=staff_id)
        except MedicalStaff.DoesNotExist:
            return Response({"error": "Medical staff not found."}, status=status.HTTP_404_NOT_FOUND)

        # Handle updating the associated User object
        user_data = request.data.get('user')
        if user_data:
            user = staff.user  # Get the related User instance

            # Check if username exists and if it's changed
            username = user_data.get('username')
            if username and username != user.username:
                # Only check for uniqueness if the username is actually being changed
                if User.objects.filter(username=username).exists():
                    return Response({"error": "A user with that username already exists."}, status=status.HTTP_400_BAD_REQUEST)
                user.username = username  # Update username

            email = user_data.get('email')
            if email and email != user.email:
                user.email = email  # Update email

            role = user_data.get('role')
            if role and role != user.role:
                user.role = role  # Update role

            # If a new password is provided, hash it
            password = user_data.get('password')
            if password:
                user.set_password(password)  # Set new password

            # Save the updated User object
            user.save()

        # Now update the MedicalStaff data (name, role, contact_info, employee_status)
        serializer = MedicalStaffSerializer(staff, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, staff_id):
        try:
            staff = MedicalStaff.objects.get(pk=staff_id)
        except MedicalStaff.DoesNotExist:
            return Response({"error": "Medical staff not found."}, status=status.HTTP_404_NOT_FOUND)

        staff.delete()
        return Response({"message": "Medical staff removed successfully."}, status=status.HTTP_204_NO_CONTENT)

class PatientListView(APIView):
    permission_classes = [IsAdmin | IsMedicalStaff | IsPatient]

    def get(self, request, patient_id=None):
        if patient_id:
            try:
                patient = Patient.objects.get(pk=patient_id)
            except Patient.DoesNotExist:
                return Response({"error": "Patient not found."}, status=status.HTTP_404_NOT_FOUND)

            serializer = PatientSerializer(patient)
            return Response(serializer.data, status=status.HTTP_200_OK)

        patients = Patient.objects.all()
        serializer = PatientSerializer(patients, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, patient_id):
        try:
            patient = Patient.objects.get(pk=patient_id)
        except Patient.DoesNotExist:
            return Response({"error": "Patient not found."}, status=status.HTTP_404_NOT_FOUND)

        # Handle updating the associated User object
        user_data = request.data.get('user')
        if user_data:
            user = patient.user  # Get the related User instance

            # Check if username exists and if it's changed
            username = user_data.get('username')
            if username and username != user.username:
                if User.objects.filter(username=username).exists():
                    return Response({"error": "A user with that username already exists."}, status=status.HTTP_400_BAD_REQUEST)
                user.username = username  # Update username

            email = user_data.get('email')
            if email and email != user.email:
                if User.objects.filter(email=email).exists():
                    return Response({"error": "A user with that email already exists."}, status=status.HTTP_400_BAD_REQUEST)
                user.email = email  # Update email

            role = user_data.get('role')
            if role and role != user.role:
                user.role = role  # Update role

            # If a new password is provided, hash it
            password = user_data.get('password')
            if password:
                user.set_password(password)  # Set new password

            # Save the updated User object
            user.save()

        # Now update the Patient data (name, address, date_of_birth, etc.)
        serializer = PatientSerializer(patient, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, patient_id):
        try:
            patient = Patient.objects.get(pk=patient_id)
        except Patient.DoesNotExist:
            return Response({"error": "Patient not found."}, status=status.HTTP_404_NOT_FOUND)

        patient.delete()
        return Response({"message": "Patient removed successfully."}, status=status.HTTP_204_NO_CONTENT)

class InvoiceListView(APIView):
    permission_classes = [IsAdmin | IsMedicalStaff | IsPatient]

    def get(self, request):
        invoices = Invoice.objects.select_related('patient').all()
        data = [
            {
                "id": invoice.invoice_id,
                "total_amount": invoice.total_amount,
                "date_issued": invoice.date_issued,
                "patient": {
                    "id": invoice.patient.patient_id,
                    "name": invoice.patient.name,
                } if invoice.patient else None,
            }
            for invoice in invoices
        ]
        return Response(data)