import React, { useState } from "react";
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

function BookAppointment() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [form, setForm] = useState({ doctor: "", reason: "" });
  const [confirmed, setConfirmed] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateTimeSlots = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const date = new Date();
        date.setHours(hour);
        date.setMinutes(min);
        const timeString = date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        times.push(timeString);
      }
    }
    return times;
  };

  const availableTimes = generateTimeSlots();

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

  return (
    <Container className="mt-5">
      <h3 className="text-center mb-4">Book an Appointment</h3>

      {confirmed && (
        <Alert variant="success" className="text-center">
          Appointment booked successfully!
        </Alert>
      )}

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
                >
                  <option value="">-- Choose your Doctor --</option>
                  <option value="Dr. Anjali Thapa">Dr. Anjali Thapa</option>
                  <option value="Dr. Sujan Prajapati">
                    Dr. Sujan Prajapati
                  </option>
                  <option value="Dr. Shalu Pokhrel">Dr. Shalu Pokhrel</option>
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
                    <Calendar
                      onChange={setSelectedDate}
                      value={selectedDate}
                      className="w-100"
                    />
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
                      required
                    >
                      <option value="">-- Choose Time --</option>
                      {availableTimes.map((time, idx) => (
                        <option key={idx} value={time}>
                          {time}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <p className="mt-3">
                <strong>Selected Appointment:</strong>{" "}
                {selectedDate.toDateString()} at {selectedTime}
              </p>
            </Col>
          </Row>

          <div className="text-center mt-4">
            <Button type="submit" variant="primary" size="lg">
              Book Appointment
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}

export default BookAppointment;
