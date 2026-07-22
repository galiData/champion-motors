import { CUSTOMER_STATUSES, type Customer, type CustomerInput } from "@/types/customer";

/** The form's raw string state — every control is a controlled string input. */
export interface CustomerFormValues {
  name: string;
  phone: string;
  email: string;
  city: string;
  status: string;
  vehicleCount: string;
  homeLocationId: string;
  customerSince: string;
  /** Empty string means "no contact yet" → stored as null. */
  lastContactAt: string;
}

export type CustomerFormErrors = Partial<Record<keyof CustomerFormValues, string>>;

const EMPTY_VALUES: CustomerFormValues = {
  name: "",
  phone: "",
  email: "",
  city: "",
  status: "lead",
  vehicleCount: "0",
  homeLocationId: "",
  customerSince: "",
  lastContactAt: "",
};

/** Seed the form from an existing customer, or blank values for a new one. */
export function customerToFormValues(customer?: Customer): CustomerFormValues {
  if (!customer) return { ...EMPTY_VALUES };
  return {
    name: customer.name,
    phone: customer.phone,
    email: customer.email,
    city: customer.city,
    status: customer.status,
    vehicleCount: String(customer.vehicleCount),
    homeLocationId: customer.homeLocationId,
    customerSince: customer.customerSince,
    lastContactAt: customer.lastContactAt ?? "",
  };
}

// Lenient Israeli phone: digits, spaces and dashes, 9–10 digits total.
const PHONE_PATTERN = /^[\d\s-]{9,15}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Validate the raw form values, returning a Hebrew message per invalid field. */
export function validateCustomerForm(values: CustomerFormValues): CustomerFormErrors {
  const errors: CustomerFormErrors = {};

  if (!values.name.trim()) errors.name = "יש להזין שם לקוח";
  if (!values.phone.trim()) errors.phone = "יש להזין מספר טלפון";
  else if (!PHONE_PATTERN.test(values.phone.trim())) errors.phone = "מספר טלפון לא תקין";

  if (!values.email.trim()) errors.email = "יש להזין כתובת דוא״ל";
  else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = "כתובת דוא״ל לא תקינה";

  if (!values.city.trim()) errors.city = "יש להזין עיר";

  if (!CUSTOMER_STATUSES.includes(values.status as never)) errors.status = "יש לבחור סטטוס";

  const count = Number(values.vehicleCount);
  if (values.vehicleCount.trim() === "" || !Number.isInteger(count) || count < 0) {
    errors.vehicleCount = "מספר כלי הרכב חייב להיות מספר שלם אי־שלילי";
  }

  if (!values.homeLocationId) errors.homeLocationId = "יש לבחור סניף בית";

  if (!values.customerSince) errors.customerSince = "יש להזין תאריך הצטרפות";

  return errors;
}

/** True when the form has no validation errors. */
export function isCustomerFormValid(values: CustomerFormValues): boolean {
  return Object.keys(validateCustomerForm(values)).length === 0;
}

/**
 * Convert validated form values into an API payload. Assumes the values have
 * already passed {@link validateCustomerForm}.
 */
export function formValuesToInput(values: CustomerFormValues): CustomerInput {
  return {
    name: values.name.trim(),
    phone: values.phone.trim(),
    email: values.email.trim(),
    city: values.city.trim(),
    status: values.status as CustomerInput["status"],
    vehicleCount: Number(values.vehicleCount),
    homeLocationId: values.homeLocationId,
    customerSince: values.customerSince,
    lastContactAt: values.lastContactAt || null,
  };
}
