function Website3D(container, params)
{
	this.params = 
	{
        perspective: 700,				// amount of perspective in field of view
        deepness: 30,
        focusOnMouse: false,
    };

    for(var i in params)
	{
		this.params[i] = params[i];
	}

	this.container = jQuery(container);
	this.mousePos = {x: 0, y: 0};
	this.init();
}

Website3D.prototype.init = function()
{
	TweenMax.to(this.container, 0, {perspective: this.params.perspective, transformStyle: "preserve-3d"});
	
	jQuery(window)
	.scroll(jQuery.proxy(this.scrollScene, this))
	.resize(jQuery.proxy(this.scrollScene, this));

	if(this.params.focusOnMouse)
	{
		jQuery(window)
		.mousemove(jQuery.proxy(this.mouseMove, this))
		.mousemove(jQuery.proxy(this.scrollScene, this));
	}

	this.lift("*[data-3d]");

	this.scrollScene();
}

Website3D.prototype.lift = function(selector)
{
	var j = jQuery(selector);
	TweenMax.to(j, 3, {z: this.params.deepness, rotationX: 0, ease: Elastic.easeOut, onComplete: jQuery.proxy(function()
	{
		TweenMax.to(j, 2, {z: this.params.deepness * 0.7, rotationX: 0, repeat: -1, yoyo: true, ease: Quad.easeInOut});
	}, this)});
	

	var b = jQuery("body")[0];
	var c = this.container[0];

	j.each(function()
	{
		var i = 0;
		var s = jQuery(this);

		do
		{
			s = s.parent();
			TweenMax.to(s, 0, {transformStyle: "preserve-3d"});
			i++;
		}
		while(s.parent()[0] != c && s.parent()[0] != b && i <= 10)
	});
}

Website3D.prototype.mouseMove = function(e)
{
	this.mousePos.x = e.clientX;
	this.mousePos.y = e.clientY;
}

Website3D.prototype.scrollScene = function()
{
	var win = jQuery(window);
	var c = this.container;

	var scrollTop = win.scrollTop() + (this.params.focusOnMouse ? this.mousePos.y : win.height() * 0.5);
	var scrollLeft = win.scrollLeft() + (this.params.focusOnMouse ? this.mousePos.x :win.width() * 0.5);

	var w = c.width();
	var h = c.height();

	var perctTop = Math.round((scrollTop * 100) / h);
	var perctLeft = Math.round((scrollLeft * 100) / w);

	TweenMax.to(c, 0, {perspectiveOrigin: perctLeft + "% " + perctTop + "%"});
}