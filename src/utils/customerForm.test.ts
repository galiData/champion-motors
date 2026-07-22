import { describe, expect, it } from "vitest";
import type { Customer } from "@/types/customer";
import {
  customerToFormValues,
  formValuesToInput,
  isCustomerFormValid,
  validateCustomerForm,
  type CustomerFormValues,
} from "@/utils/customerForm";

const VALID: CustomerFormValues = {
  name: "מיכל אברהמי",
  phone: "052-4471190",
  email: "michal.a@example.co.il",
  city: "רמת גן",
  status: "active",
  vehicleCount: "2",
  homeLocationId: "loc-tlv",
  customerSince: "2019-04-12",
  lastContactAt: "2026-07-02",
};

describe("validateCustomerForm", () => {
  it("returns no errors for a fully valid form", () => {
    expect(validateCustomerForm(VALID)).toEqual({});
    expect(isCustomerFormValid(VALID)).toBe(true);
  });

  it("requires a name", () => {
    expect(validateCustomerForm({ ...VALID, name: "   " }).name).toBeDefined();
  });

  it("rejects a malformed email", () => {
    expect(validateCustomerForm({ ...VALID, email: "not-an-email" }).email).toBeDefined();
  });

  it("rejects a malformed phone", () => {
    expect(validateCustomerForm({ ...VALID, phone: "12" }).phone).toBeDefined();
  });

  it("rejects a negative or non-integer vehicle count", () => {
    expect(validateCustomerForm({ ...VALID, vehicleCount: "-1" }).vehicleCount).toBeDefined();
    expect(validateCustomerForm({ ...VALID, vehicleCount: "1.5" }).vehicleCount).toBeDefined();
    expect(validateCustomerForm({ ...VALID, vehicleCount: "" }).vehicleCount).toBeDefined();
  });

  it("requires a home location and a status from the known set", () => {
    expect(validateCustomerForm({ ...VALID, homeLocationId: "" }).homeLocationId).toBeDefined();
    expect(validateCustomerForm({ ...VALID, status: "bogus" }).status).toBeDefined();
  });

  it("treats last contact as optional", () => {
    expect(validateCustomerForm({ ...VALID, lastContactAt: "" }).lastContactAt).toBeUndefined();
  });
});

describe("formValuesToInput", () => {
  it("trims strings, coerces the vehicle count and nulls an empty last contact", () => {
    const input = formValuesToInput({ ...VALID, name: "  נועה  ", vehicleCount: "3", lastContactAt: "" });
    expect(input).toEqual({
      name: "נועה",
      phone: "052-4471190",
      email: "michal.a@example.co.il",
      city: "רמת גן",
      status: "active",
      vehicleCount: 3,
      homeLocationId: "loc-tlv",
      customerSince: "2019-04-12",
      lastContactAt: null,
    });
  });
});

describe("customerToFormValues", () => {
  it("round-trips an existing customer into editable string values", () => {
    const customer: Customer = {
      id: "cus-1001",
      name: "מיכל אברהמי",
      phone: "052-4471190",
      email: "michal.a@example.co.il",
      city: "רמת גן",
      status: "active",
      vehicleCount: 2,
      homeLocationId: "loc-tlv",
      customerSince: "2019-04-12",
      lastContactAt: "2026-07-02",
    };
    expect(customerToFormValues(customer)).toEqual(VALID);
  });

  it("maps a null last contact to an empty string", () => {
    const blank = customerToFormValues();
    expect(blank.lastContactAt).toBe("");
    expect(blank.name).toBe("");
  });
});
