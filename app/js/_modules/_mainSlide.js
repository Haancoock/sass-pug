var mainSlider = (function(){
	
	var _currentSlide = 0;
	var _slides = document.querySelectorAll('.main-slider__element');

	var init = function(){
		_setUpListners();
	};

	var _setUpListners = function(){
		$('.prev-button').on('click', _prevSlide);
		$('.next-button').on('click', _nextSlide);
	};

	var _prevSlide = function(e){
		e.preventDefault();
		_toSlide(_currentSlide - 1);
	};

	var _nextSlide = function(e){
		e.preventDefault();
		_toSlide(_currentSlide + 1);
	};

	var _toSlide = function(n){
		_slides[_currentSlide].className = 'main-slider__element';
		_currentSlide = (n+_slides.length)%_slides.length;
		_slides[_currentSlide].className += " main-slider__element-shown";
	};
 
	return {
		init: init
	};

})(); 

mainSlider.init();