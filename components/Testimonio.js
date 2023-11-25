import React from 'react';
import Image from 'next/image';

export default function Testimonio({ testimonial }) {
  return (
    <div className="testimonial-container">
      <div className="avatar-container">
        <Image
          src={testimonial?.avatar}
          alt={testimonial?.name}
          width={1000}
          height={1000}
          className="avatar"
        />
      </div>

      <div className="testimonial-content">
        <h3 className="font-bold">{testimonial?.title}</h3>
        <p>{testimonial?.description}</p>
        <p className="font-bold">- {testimonial?.name}</p>
      </div>
    </div>
  );
}
