import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Alert,
  Card,
  ListGroup,
} from "react-bootstrap";
import { FaCalendarAlt, FaClock, FaUserMd, FaClipboard } from "react-icons/fa";
import { fetchDoctorAvailability } from "../../axios/availabilityAxios";
import { fetchDoctors } from "../../axios/doctorAxios";

// Custom styles
const styles = {
  doctorCard: {
    marginBottom: "2rem",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  availabilityList: {
    listStyle: "none",
    paddingLeft: "0",
  },
  timeSlot: {
    fontSize: "0.9em",
    color: "#666",
  },
};

function BookAppointment() {
  // State management
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [form, setForm] = useState({ doctor: "", reason: "" });
  const [confirmed, setConfirmed] = useState(false);
  const [doctorAvailability, setDoctorAvailability] = useState({});

  // Modified derived state for available dates and times
  const availableDates =
    selectedDoctor && doctorAvailability[selectedDoctor]
      ? [
          ...new Set(
            doctorAvailability[selectedDoctor].map((slot) => slot.date)
          ),
        ]
      : [];

  const availableTimes =
    selectedDoctor && selectedDate && doctorAvailability[selectedDoctor]
      ? doctorAvailability[selectedDoctor]
          .filter((slot) => slot.date === selectedDate)
          .map((slot) => slot.times)
      : [];

  // Load doctors and their availability
  useEffect(() => {
    const loadDoctorsData = async () => {
      setLoading(true);
      try {
        const response = await fetchDoctors();
        if (response?.success && Array.isArray(response.data)) {
          setDoctors(response.data);
          const availabilityMap = {};

          // Fetch availability for each doctor
          await Promise.all(
            response.data.map(async (doctor) => {
              try {
                const availability = await fetchDoctorAvailability(doctor._id);
                if (Array.isArray(availability)) {
                  availabilityMap[doctor._id] = availability.map((slot) => ({
                    date: new Date(slot.date).toLocaleDateString(),
                    times: `${slot.start} - ${slot.end}`,
                  }));
                }
              } catch (error) {
                console.error(
                  `Error fetching availability for doctor ${doctor.name}:`,
                  error
                );
              }
            })
          );

          setDoctorAvailability(availabilityMap);
        }
      } catch (err) {
        setError("Failed to load doctors. Please try again later.");
        console.error("Error loading doctors:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDoctorsData();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "doctor") {
      setSelectedDoctor(value);
      setSelectedDate("");
      setSelectedTime("");
      setForm((prev) => ({ ...prev, doctor: value }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Add new handlers for date and time selection
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setSelectedDate(selectedDate);
    setSelectedTime(""); // Reset time when date changes
  };

  const handleTimeChange = (e) => {
    const selectedTime = e.target.value;
    setSelectedTime(selectedTime);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTime || !selectedDate || !selectedDoctor) {
      setError("Please select all required fields");
      return;
    }

    setLoading(true);
    try {
      // Add your appointment booking API call here
      const appointmentData = {
        doctorId: selectedDoctor,
        date: selectedDate,
        time: selectedTime,
        reason: form.reason,
      };

      // TODO: Add your booking API call
      console.log("Booking appointment:", appointmentData);

      setConfirmed(true);
      setForm({ doctor: "", reason: "" });
      setSelectedDate("");
      setSelectedTime("");
    } catch (err) {
      setError("Failed to book appointment. Please try again.");
      console.error("Booking error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <h3 className="text-center mb-4">Book an Appointment</h3>

      {/* Status messages */}
      {confirmed && (
        <Alert
          variant="success"
          dismissible
          onClose={() => setConfirmed(false)}
        >
          Appointment booked successfully!
        </Alert>
      )}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      {loading && <Alert variant="info">Processing your request...</Alert>}

      {/* Doctor availability section */}
      <Card style={styles.doctorCard}>
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">Available Doctors & Schedules</h5>
        </Card.Header>
        <Card.Body>
          {doctors.length === 0 ? (
            <Alert variant="info">No doctors available at the moment.</Alert>
          ) : (
            <ListGroup variant="flush">
              {doctors.map((doctor) => (
                <ListGroup.Item key={doctor._id}>
                  <h6>Dr. {doctor.name}</h6>
                  {doctorAvailability[doctor._id]?.length > 0 ? (
                    <ul style={styles.availabilityList}>
                      {[
                        ...new Set(
                          doctorAvailability[doctor._id].map(
                            (slot) => slot.date
                          )
                        ),
                      ].map((date) => (
                        <li key={date}>
                          {date}:{" "}
                          {doctorAvailability[doctor._id]
                            .filter((slot) => slot.date === date)
                            .map((slot) => slot.times)
                            .join(", ")}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted mb-0">No available slots</p>
                  )}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>

      {/* Booking form */}
      <Card className="mt-4 p-4">
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
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      Dr. {doctor.name}
                    </option>
                  ))}
                </Form.Select>
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
                      onChange={handleDateChange}
                      disabled={!selectedDoctor || !availableDates.length}
                    >
                      <option value="">Choose a date...</option>
                      {availableDates.map((date) => (
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
                      onChange={handleTimeChange}
                      disabled={!selectedDate || !availableTimes.length}
                    >
                      <option value="">Choose a time...</option>
                      {availableTimes.map((time, index) => (
                        <option key={index} value={time}>
                          {time}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {(selectedDate || selectedTime) && (
                <p className="mt-3">
                  <strong>Selected Appointment:</strong> {selectedDate}{" "}
                  {selectedTime && `at ${selectedTime}`}
                </p>
              )}
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
