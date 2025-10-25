import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import './EmployeeForm.css';

function EmployeeForm() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [lastData, setLastData] = useState(null);
  const fromDateVal = watch("fromDate");

  function isValidOfficialName(value) {
    if (!value) return "This field is required";
    if (!/^[A-Z][a-zA-Z ]{1,49}$/.test(value))
      return "Must start with a capital letter; only letters and spaces allowed";
    if (/([a-zA-Z])\1{2,}/.test(value))
      return "No more than two repeated letters in sequence";
    if (value.toUpperCase() === value)
      return "Do not use ALL CAPS; use normal capitalization";
    if (value.toLowerCase() === value)
      return "Do not use all lowercase; use normal capitalization";
    return true;
  }

  // Map division dropdown values to departmentIds (Oracle table)
  const departmentIdMap = {
    SDD: 101,
    CND: 102,
    Network: 103 // Make sure these match your departments table exactly
  };

  const onSubmit = (data) => {
  const payload = {
    empId: data.empId,
    empName: data.empName,
    phone: data.phone,
    address: data.address,
    age: parseInt(data.age, 10),
    gender: data.gender,
    roleName: data.roleName,
    roleNumber: data.roleNumber,
    fromDate: data.fromDate,
    toDate: data.toDate,
    naFlag: data.naFlag,
    directorate: data.directorate,
    division: data.division,
    email: data.email || null
  };

  fetch('http://localhost:8080/api/employees', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then((res) => {
      if (res.ok) {
        toast.success('Employee data submitted successfully!');
        setLastData(payload);
      } else {
        toast.error('Failed to save employee.');
      }
    })
    .catch(() => toast.error('Network error'));
};


  return (
    <>
      <form className="employee-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-section">Personal Details</div>
        <div className="field-grid">
          <div>
            <label>Employee ID</label>
            <input
              {...register("empId", {
                required: "Employee ID is required",
                pattern: {
                  value: /^\d{6}$/,
                  message: "Employee ID must be exactly 6 digits, numbers only",
                },
              })}
              placeholder="Employee ID"
              maxLength={6}
            />
            <span>{errors.empId?.message}</span>
          </div>
          <div>
            <label>Employee Name</label>
            <input
              {...register("empName", {
                required: "Employee Name is required",
                minLength: { value: 2, message: "At least 2 characters" },
                maxLength: { value: 50, message: "Must be under 50 characters" },
                validate: isValidOfficialName,
              })}
              placeholder="Employee Name"
            />
            <span>{errors.empName?.message}</span>
          </div>
          <div>
            <label>Phone</label>
            <input
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[6-9]\d{9}$/,
                  message: "Phone must be a valid 10-digit Indian number (starts with 6/7/8/9)",
                },
              })}
              placeholder="Phone"
              maxLength={10}
            />
            <span>{errors.phone?.message}</span>
          </div>
          <div>
            <label>Address</label>
            <input
              {...register("address", {
                maxLength: { value: 100, message: "Address must be under 100 characters" },
              })}
              placeholder="Address"
            />
            <span>{errors.address?.message}</span>
          </div>
          <div>
            <label>Age</label>
            <input
              {...register("age", {
                required: "Age is required",
                pattern: { value: /^\d+$/, message: "Age must be digits only" },
                min: { value: 18, message: "Minimum age is 18" },
                max: { value: 80, message: "Maximum age is 80" },
              })}
              placeholder="Age"
            />
            <span>{errors.age?.message}</span>
          </div>
          <div>
            <label>Gender</label>
            <select {...register("gender", { required: "Gender selection is required" })}>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <span>{errors.gender?.message}</span>
          </div>
        </div>
        <div className="form-section">Role Details</div>
        <div className="field-grid">
          <div>
            <label>Role Name</label>
            <input
              {...register("roleName", {
                required: "Role Name is required",
                minLength: { value: 2, message: "At least 2 characters" },
                maxLength: { value: 50, message: "Must be under 50 characters" },
                validate: isValidOfficialName,
              })}
              placeholder="Role Name"
            />
            <span>{errors.roleName?.message}</span>
          </div>
          <div>
            <label>Role Number</label>
            <input
              {...register("roleNumber", {
                required: "Role Number is required",
                pattern: { value: /^\d+$/, message: "Role Number must contain digits only" },
              })}
              placeholder="Role Number"
              maxLength={6}
            />
            <span>{errors.roleNumber?.message}</span>
          </div>
          <div>
            <label>From Date</label>
            <input
              {...register("fromDate", { required: "From Date selection is required" })}
              type="date"
            />
            <span>{errors.fromDate?.message}</span>
          </div>
          <div>
            <label>To Date</label>
            <input
              {...register("toDate", {
                validate:
                  (value) => !value || !fromDateVal || value >= fromDateVal || "To Date cannot be before From Date",
              })}
              type="date"
            />
            <span>{errors.toDate?.message}</span>
          </div>
          <div>
            <label>NA Flag</label>
            <select {...register("naFlag", { required: "NA Flag selection is required" })}>
              <option value="">Select</option>
              <option value="Y">Y</option>
              <option value="N">N</option>
            </select>
            <span>{errors.naFlag?.message}</span>
          </div>
          <div>
            <label>Directorate</label>
            <select {...register("directorate", { required: "Directorate selection is required" })}>
              <option value="">Select</option>
              <option value="DIT">DIT</option>
              <option value="DWST">DWST</option>
              <option value="DOVI">DOVI</option>
            </select>
            <span>{errors.directorate?.message}</span>
          </div>
          <div>
            <label>Division</label>
            <select {...register("division", { required: "Division selection is required" })}>
              <option value="">Select</option>
              <option value="SDD">SDD</option>
              <option value="CND">CND</option>
              <option value="Network">Network</option>
            </select>
            <span>{errors.division?.message}</span>
          </div>
          <div>
            <label>Email (optional)</label>
            <input {...register("email")} placeholder="Email" />
          </div>
        </div>
        <button type="submit">Add Employee</button>
      </form>
      {lastData && (
        <div className="temp-output">
          <h3>Current Form Data (not saved):</h3>
          <pre style={{
            background: '#f5f5f5',
            border: '1px solid #ccc',
            padding: '12px',
            marginTop: '16px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '1em'
          }}>
            {JSON.stringify(lastData, null, 2)}
          </pre>
        </div>
      )}
    </>
  );
}

export default EmployeeForm;
