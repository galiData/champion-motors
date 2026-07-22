import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  CUSTOMER_STATUS_LABELS,
  CUSTOMER_STATUSES,
  type Customer,
  type CustomerInput,
} from "@/types/customer";
import type { Location } from "@/types/location";
import {
  customerToFormValues,
  formValuesToInput,
  validateCustomerForm,
  type CustomerFormValues,
} from "@/utils/customerForm";

export interface CustomerFormProps {
  locations: Location[];
  onSubmit: (input: CustomerInput) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
  submitLabel: string;
  /** Omit for a new customer; pass a record to edit it. */
  initialValue?: Customer;
  /** Hebrew message from a failed save, shown above the actions. */
  saveError?: string;
}

/**
 * Shared create/edit form for a customer. Validation and the value ↔ payload
 * mapping live in `utils/customerForm` so they stay unit-testable; this
 * component owns only the controlled inputs and when to reveal errors.
 */
export function CustomerForm({
  locations,
  onSubmit,
  onCancel,
  isSaving,
  submitLabel,
  initialValue,
  saveError,
}: CustomerFormProps) {
  const [values, setValues] = useState<CustomerFormValues>(() =>
    customerToFormValues(initialValue),
  );
  const [submitted, setSubmitted] = useState(false);

  const errors = validateCustomerForm(values);
  const shown = submitted ? errors : {};

  const setField =
    (field: keyof CustomerFormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setValues((prev) => ({ ...prev, [field]: event.target.value }));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    await onSubmit(formValuesToInput(values));
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-6 sm:grid-cols-2">
      <Field htmlFor="cf-name" label="שם הלקוח" required error={shown.name}>
        <Input id="cf-name" value={values.name} onChange={setField("name")} autoComplete="off" />
      </Field>

      <Field htmlFor="cf-phone" label="טלפון" required error={shown.phone}>
        <Input
          id="cf-phone"
          dir="ltr"
          inputMode="tel"
          value={values.phone}
          onChange={setField("phone")}
        />
      </Field>

      <Field htmlFor="cf-email" label="דוא״ל" required error={shown.email}>
        <Input
          id="cf-email"
          type="email"
          dir="ltr"
          value={values.email}
          onChange={setField("email")}
        />
      </Field>

      <Field htmlFor="cf-city" label="עיר" required error={shown.city}>
        <Input id="cf-city" value={values.city} onChange={setField("city")} />
      </Field>

      <Field htmlFor="cf-status" label="סטטוס" required error={shown.status}>
        <Select id="cf-status" value={values.status} onChange={setField("status")}>
          {CUSTOMER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {CUSTOMER_STATUS_LABELS[status]}
            </option>
          ))}
        </Select>
      </Field>

      <Field htmlFor="cf-vehicles" label="מספר כלי רכב" required error={shown.vehicleCount}>
        <Input
          id="cf-vehicles"
          type="number"
          min={0}
          step={1}
          dir="ltr"
          value={values.vehicleCount}
          onChange={setField("vehicleCount")}
        />
      </Field>

      <Field htmlFor="cf-location" label="סניף בית" required error={shown.homeLocationId}>
        <Select id="cf-location" value={values.homeLocationId} onChange={setField("homeLocationId")}>
          <option value="">בחירת סניף…</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </Select>
      </Field>

      <Field htmlFor="cf-since" label="לקוח מאז" required error={shown.customerSince}>
        <Input
          id="cf-since"
          type="date"
          dir="ltr"
          value={values.customerSince}
          onChange={setField("customerSince")}
        />
      </Field>

      <Field htmlFor="cf-contact" label="קשר אחרון" error={shown.lastContactAt}>
        <Input
          id="cf-contact"
          type="date"
          dir="ltr"
          value={values.lastContactAt}
          onChange={setField("lastContactAt")}
        />
      </Field>

      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "שומר…" : submitLabel}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving}>
          ביטול
        </Button>
        {saveError ? (
          <p role="alert" className="text-sm text-cm-red">
            {saveError}
          </p>
        ) : null}
      </div>
    </form>
  );
}
