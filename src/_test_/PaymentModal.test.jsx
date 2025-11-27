// src/_test_/PaymentModal.test.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PaymentModal from "../components/PaymentModal";

// Mock Stripe Elements wrapper
jest.mock("@stripe/react-stripe-js", () => ({
  Elements: ({ children }) => <div data-testid="mock-elements">{children}</div>,
}));

// Mock StripePaymentForm component
jest.mock("../components/StripePaymentForm", () => {
  return ({ onSuccess }) => (
    <div>
      <button onClick={() => onSuccess({ status: "success" })}>
        Mock Pay
      </button>
    </div>
  );
});

const bookingData = {
  tour: { title: "Amazing Tour", location: "Vancouver" },
  startDate: "2024-12-31T00:00:00.000Z",
  numberOfParticipants: 3,
  totalPrice: 150,
  bookingId: "B123",
};

// Helper: render modal with default props
const setup = (props = {}) => {
  return render(
    <PaymentModal
      isOpen={true}
      onClose={props.onClose || jest.fn()}
      bookingData={bookingData}
      onPaymentSuccess={props.onPaymentSuccess || jest.fn()}
    />
  );
};

describe("PaymentModal Component", () => {
  test("renders correctly when open", () => {
    setup();

    // Title
    expect(screen.getByText("Complete Your Payment")).toBeInTheDocument();

    // Tour info
    expect(screen.getByText("Amazing Tour")).toBeInTheDocument();
    expect(screen.getByText("Vancouver")).toBeInTheDocument();

    // Match "Participants:" including emoji using regex
    expect(screen.getByText(/Participants:/)).toBeInTheDocument();

    // Stripe mocked wrapper
    expect(screen.getByTestId("mock-elements")).toBeInTheDocument();
  });

  test("does not render when closed", () => {
    render(
      <PaymentModal
        isOpen={false}
        onClose={jest.fn()}
        bookingData={bookingData}
        onPaymentSuccess={jest.fn()}
      />
    );

    // Nothing should render
    expect(screen.queryByText("Complete Your Payment")).toBeNull();
  });

  test("clicking overlay triggers onClose", () => {
    const onClose = jest.fn();
    setup({ onClose });

    // overlay is the FIRST <div> rendered by PaymentModal
    const overlay = document.querySelector("body > div > div");

    fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalled();
  });

  test("clicking modal content DOES NOT close modal", () => {
    const onClose = jest.fn();
    setup({ onClose });

    // modal content is the second-level <div>
    const modal = document.querySelector("body > div > div > div");

    fireEvent.click(modal);
    expect(onClose).not.toHaveBeenCalled();
  });

  test("payment success triggers callback", () => {
    const onPaymentSuccess = jest.fn();
    setup({ onPaymentSuccess });

    fireEvent.click(screen.getByText("Mock Pay"));

    expect(onPaymentSuccess).toHaveBeenCalledWith({ status: "success" });
  });
});
