import data from '../utils/data.js';
import Testimonio from './Testimonio';
import { Carousel } from 'react-responsive-carousel';

export default function Testimonios() {
  const { testimonios } = data;

  return (
    <>
      <div className="my-9" id="testimonios">
        <Carousel
          showArrows={true}
          showThumbs={false}
          showStatus={false}
          showIndicators={false}
          infiniteLoop={true}
          centerMode={true}
          centerSlidePercentage={100}
          emulateTouch={true}
          swipeable={true}
          autoPlay={true}
          interval={3000}
        >
          {testimonios.map((testimonial) => (
            <Testimonio key={testimonial.id} testimonial={testimonial} />
          ))}
        </Carousel>
      </div>
    </>
  );
}
