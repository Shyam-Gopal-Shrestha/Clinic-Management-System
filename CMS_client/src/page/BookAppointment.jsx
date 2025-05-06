import React, { useState } from "react";
import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";
import Calendar from "react-calendar";

function BookAppointment() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [form, setForm] = useState({
    doctor: "",
    time: "",
    reason: "",
  });
  const [confirmed, setConfirmed] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Normally you'd send data to a backend here
    setConfirmed(true);
  };

  return (
    <Container className="mt-4">
      <h3>Book an Appointment</h3>
      {confirmed && (
        <Alert variant="success">Appointment booked successfully!</Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Select a Doctor</Form.Label>
              <Form.Select
                name="doctor"
                value={form.doctor}
                onChange={handleChange}
                required
              >
                <option value="">-- Choose --</option>
                <option value="Dr. Anjali Thapa">Dr. Anjali Thapa</option>
                <option value="Dr. Sujan Prajapati">Dr. Sujan Prajapati</option>
                <option value="Dr. Shalu Pokhrel">Dr. Shalu Pokhrel</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Select Time</Form.Label>
              <Form.Control
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Reason for Visit</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="reason"
                value={form.reason}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Label>Choose a Date</Form.Label>
            <Calendar value={selectedDate} onChange={setSelectedDate} />
            <p className="mt-3">
              Selected Date: <strong>{selectedDate.toDateString()}</strong>
            </p>
          </Col>
        </Row>

        <Button type="submit" variant="primary">
          Book Appointment
        </Button>
      </Form>
    </Container>
  );
}

export default BookAppointment;
