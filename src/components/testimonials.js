import React from "react";
import "../Assets/css/main.css";
import { HiStar } from "react-icons/hi";

const testimonials = [
    {
        id: 1,
        name: "John Doe",
        image: "/assets/testimonials/john.jpg",
        message: "Great quality products and fast delivery! Highly recommended.",
        rating: 5,
    },
    {
        id: 2,
        name: "Jane Smith",
        image: "/assets/testimonials/jane.jpg",
        message: "Amazing customer service. I'm very satisfied with my purchase!",
        rating: 4,
    },
    {
        id: 3,
        name: "Michael Lee",
        image: "/assets/testimonials/michael.jpg",
        message: "The products exceeded my expectations. Will order again!",
        rating: 5,
    },
];

const Testimonials = () => {
    return (
        <section className="testimonials">
            <h2>What Our Customers Say</h2>
            <div className="testimonial-container">
                {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="testimonial-card">
                        {/* <img src={testimonial.image} alt={testimonial.name} className="testimonial-image" /> */}
                        <p className="testimonial-message">"{testimonial.message}"</p>
                        <div className="testimonial-rating">
                            {[...Array(testimonial.rating)].map((_, index) => (
                                <HiStar key={index} className="star-icon" />
                            ))}
                        </div>
                        <h4 className="testimonial-name">{testimonial.name}</h4>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Testimonials;
