// Visualization of Sol3 by Andrew Geng http://math.uchicago.edu/~ageng/
// First presented at the 2015 Workshop in Geometric Topology at TCU
$(document).ready((function (CANVAS) {
	var TWOPI = 2 * Math.PI;
	var SHRINKAGE = 0.9;
	var NEAR = 0.1;
	CANVAS = CANVAS || '#img_sol3';
	function transformVert(x, y, z, s) {
		var u = s*(x+z);
		var v = (x-z)/s;
		z = (u - v)/2;
		u = (u + v)/2;
		v = 0.8 * y + 0.6 * z;
		var w = -0.6 * y + 0.8 * z;
		return [u, v, 2+w];
	}
	function clipPolygon(p) {
		var ans = [];
		var i = 0;
		for (i = 0; i < p.length; i++) {
			if (p[i][2] > NEAR) { break; }
		}
		if (i >= p.length) { return ans; } // No verts to draw
		ans.push(p[i]);
		var start = i;
		var last_visible = true;
		var visible;
		var t = 0;
		var last = p[i];
		for (i = start + 1; i != start; i = (i + 1) % p.length) {
			visible = (p[i][2] > NEAR);
			// If crossing the NEAR plane, push its intersection point.
			if (visible ^ last_visible) {
				t = (NEAR - last[2])/(p[i][2] - last[2]);
				ans.push([t*p[i][0] + (1-t)*last[0], t*p[i][1] + (1-t)*last[1], NEAR]);
			}
			if (visible) {
				ans.push(p[i]);
			}
			last_visible = visible;
			last = p[i];
		}
		return ans;
	}
	function drawPolygon(context, p) {
		p = clipPolygon(p);
		if (p.length < 2) { return; }
		context.beginPath();
		context.moveTo(p[0][0]/p[0][2], p[0][1]/p[0][2]);
		for (var i = 0; i < p.length; i++) {
			context.lineTo(p[i][0]/p[i][2], p[i][1]/p[i][2]);
		}
		context.closePath();
	}
	function drawPlane(context, height, y) {
		var s = Math.exp(height - y);
		drawPolygon(context, [
			transformVert(0, height, 1, s),
			transformVert(1, height, 0, s),
			transformVert(0, height, -1, s),
			transformVert(-1, height, 0, s),
		]);
	}
	function draw(x, y, cursor) {
		// Prep canvas
		var canvas = $(CANVAS)[0];
		var w = canvas.width;
		canvas.width = canvas.height = w;
		var c = canvas.getContext('2d');
		c.save();
		c.translate(w/2, w/2);
		c.scale(w * 0.5 * SHRINKAGE, -w * 0.5 * SHRINKAGE);
		// Set style
		c.lineWidth = 0.01;
		c.strokeStyle = '#000';
		c.fillStyle = 'rgba(255, 255, 255, 0.5)';
		var cursor_drawn = false;
		function draw_cursor() {
			c.fillStyle = 'rgba(0, 0, 255, 0.5)';
			drawPlane(c, y, y);
			c.stroke();
			c.fill();
			c.fillStyle = 'rgba(255, 255, 255, 0.5)';
			cursor_drawn = true;
		}
		for (var i = -1; i <= 1; i += 0.2) {
			if (cursor && (i > y) && !cursor_drawn) {
				draw_cursor();
			}
			drawPlane(c, i, y);
			c.stroke();
			c.fill();
		}
		if (cursor && !cursor_drawn) {
			draw_cursor();
		}
		c.restore();
	}
	function handlePan(e) {
		var o = $(CANVAS).offset();
		var scale = 2 / $(CANVAS)[0].width;
		var x = $(document).scrollLeft() + e.center.x - o.left;
		var y = $(document).scrollTop() + e.center.y - o.top;
		x = (x * scale - 1) / SHRINKAGE;
		y = (y * scale - 1) / SHRINKAGE;
		e.preventDefault();
		draw(x, -y, true);
	}
	$(CANVAS).css('cursor', 'default');
	var h = new Hammer.Manager($(CANVAS)[0]);
	h.add(new Hammer.Pan({direction: Hammer.DIRECTION_ALL, threshold: 0, pointers: 0}));
	h.on('pan', handlePan);
	draw(0, 0);
}).bind(null, $('script[data-canvas]').last().data('canvas')));
