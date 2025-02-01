"use client";

export function FarmMap() {
	return (
		<div className="h-full w-full bg-[#1a1a1a]">
			<iframe
				src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15000!2d-95.7129!3d37.0902!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sus!4v1635787415478!5m2!1sen!2sus"
				className="h-full w-full border-0"
				allowFullScreen=""
				loading="lazy"
				referrerPolicy="no-referrer-when-downgrade"
			></iframe>
		</div>
	);
}
