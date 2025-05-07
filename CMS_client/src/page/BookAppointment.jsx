import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Alert,
  Card,
} from "react-bootstrap";
import { FaCalendarAlt, FaClock, FaUserMd, FaClipboard } from "react-icons/fa";
import { fetchDoctorAvailability } from "../../axios/availabilityAxios";
import { fetchDoctors } from "../../axios/doctorAxios";

// Add custom styles
const calendarStyles = `
  .available-date {
    background-color: #e6ffe6;
    color: #006600;
    font-weight: bold;
  }
  .react-calendar__tile:disabled {
    background-color: #f0f0f0;
    color: #cccccc;
  }
`;

// Add style tag to the component
function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Add missing state variables
  const [availableSlots, setAvailableSlots] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [form, setForm] = useState({ doctor: "", reason: "" });
  const [confirmed, setConfirmed] = useState(false);

  // Move these calculations after state declarations
  const availableTimes = selectedDate
    ? availableSlots
        .filter(
          (slot) => new Date(slot.date).toLocaleDateString() === selectedDate
        )
        .map((slot) => ({
          start: slot.start,
          end: slot.end,
        }))
    : [];

  const uniqueAvailableDates = [
    ...new Set(
      availableSlots.map((slot) => new Date(slot.date).toLocaleDateString())
    ),
  ];

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = calendarStyles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  // Fetch all doctors when component mounts
  useEffect(() => {
    const loadDoctors = async () => {
      setLoading(true);
      setError("");

      try {
        const doctorsList = await fetchDoctors();
        console.log("Loaded doctors:", doctorsList);
        setDoctors(doctorsList || []);
      } catch (err) {
        console.error("Error loading doctors:", err);
        setError(err.message || "Failed to load doctors");
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
  }, []);

  // Fetch availability when doctor is selected
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!selectedDoctor) return;

      setLoading(true);
      try {
        const response = await fetchDoctorAvailability(selectedDoctor);
        console.log("Raw availability response:", response);

        // Check if response is an array and has items
        if (Array.isArray(response) && response.length > 0) {
          setAvailableSlots(response);

          // Extract and format unique dates
          const dates = [
            ...new Set(
              response.map((slot) => new Date(slot.date).toLocaleDateString())
            ),
          ];

          console.log("Formatted available dates:", dates);
          setAvailableDates(dates);
        } else {
          setAvailableSlots([]);
          setAvailableDates([]);
          setError("No available slots for this doctor");
        }
      } catch (err) {
        console.error("Error fetching availability:", err);
        setError("Failed to load doctor availability");
        setAvailableSlots([]);
        setAvailableDates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [selectedDoctor]);

  // Update handleDateSelect function
  const handleDateSelect = (date) => {
    const formattedDate = date.toLocaleDateString();
    console.log("Selected date:", formattedDate);
    setSelectedDate(formattedDate);

    // Filter times for selected date
    const timesForDate = availableSlots
      .filter((slot) => {
        const slotDate = new Date(slot.date).toLocaleDateString();
        console.log("Comparing dates:", { slotDate, formattedDate });
        return slotDate === formattedDate;
      })
      .map((slot) => ({
        start: slot.start,
        end: slot.end,
      }));

    console.log("Available times for selected date:", timesForDate);
  };

  // Update form handling
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "doctor") {
      console.log("Selected doctor ID:", value);
      setSelectedDoctor(value);
      // Reset date and time when doctor changes
      setSelectedDate("");
      setSelectedTime("");
      setAvailableSlots([]);
      setAvailableDates([]);
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedTime) {
      alert("Please select a time.");
      return;
    }

    const datetime = new Date(selectedDate);
    const timeParts = selectedTime.match(/(\d+):(\d+)\s?(AM|PM)/i);
    let hours = parseInt(timeParts[1], 10);
    const minutes = parseInt(timeParts[2], 10);
    const ampm = timeParts[3].toUpperCase();

    if (ampm === "PM" && hours !== 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;

    datetime.setHours(hours);
    datetime.setMinutes(minutes);

    console.log("Appointment booked:", {
      ...form,
      date: datetime.toLocaleString(),
    });

    setConfirmed(true);
  };

  const tileDisabled = ({ date }) => {
    const formattedDate = date.toLocaleDateString();
    return !availableDates.includes(formattedDate);
  };

  const tileClassName = ({ date, view }) => {
    if (
      view === "month" &&
      uniqueAvailableDates.includes(date.toDateString())
    ) {
      return "available-date";
    }
    return null;
  };

  const handleDoctorChange = (e) => {
    setSelectedDoctor(e.target.value);
    setError("");
  };

  return (
    <Container className="mt-5">
      <h3 className="text-center mb-4">Book an Appointment</h3>

      {confirmed && (
        <Alert variant="success" className="text-center">
          Appointment booked successfully!
        </Alert>
      )}

      {error && <Alert variant="danger">{error}</Alert>}
      {loading && <Alert variant="info">Loading...</Alert>}

      <Card className="p-4 shadow-lg">
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Select a Doctor <FaUserMd />
                </Form.Label>
                <Form.Select
                  name="doctor"
                  value={form.doctor}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="">-- Choose your Doctor --</option>
                  {doctors.length > 0 ? (
                    doctors.map((doctor) => (
                      <option key={doctor._id} value={doctor._id}>
                        Dr. {doctor.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No doctors available</option>
                  )}
                </Form.Select>
                {error && (
                  <Form.Text className="text-danger">{error}</Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  Reason for Visit <FaClipboard />
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  required
                  placeholder="Enter the reason for your visit..."
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Row>
                <Col md={12} className="mb-3">
                  <Form.Group>
                    <Form.Label>
                      Select a Date <FaCalendarAlt />
                    </Form.Label>
                    <Form.Select
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      disabled={!uniqueAvailableDates.length}
                    >
                      <option value="">Choose a date...</option>
                      {uniqueAvailableDates.map((date) => (
                        <option key={date} value={date}>
                          {date}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group>
                    <Form.Label>
                      Select a Time <FaClock />
                    </Form.Label>
                    <Form.Select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      disabled={!availableTimes.length}
                    >
                      <option value="">Choose a time...</option>
                      {availableTimes.map((time, index) => (
                        <option key={index} value={`${time.start}-${time.end}`}>
                          {time.start} - {time.end}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <p className="mt-3">
                <strong>Selected Appointment:</strong> {selectedDate} at{" "}
                {selectedTime}
              </p>
            </Col>
          </Row>

          <div className="text-center mt-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={
                loading || !selectedDoctor || !selectedDate || !selectedTime
              }
            >
              Book Appointment
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}

export default BookAppointment;
