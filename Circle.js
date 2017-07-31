function Circle (pos, rad, vel, col, mass, e, rest) {
	this.pos = pos || createVector(random(100,1150),random(100,500)); // compulsory
	this.prevpos = createVector(this.pos.x, this.pos.y); // compulsory
	this.rad = rad || random(2,4); // compulsory
	this.vel = vel || p5.Vector.random2D(); // compulsory
	this.col = col || createVector(random(0,255),255,90);
	this.mass = mass || 2 * this.rad; // compulsory
	this.invmass = 1/this.mass; // compulsory
	this.elast = (e == null) ? 0.95 : e; // compulsory
	this.typ = "Circle"; // compulsory
	this.movementRestricted = rest || false; // compulsory
	this.accel = createVector(0,0); // compulsory
	this.force = createVector(0,0); // compulsory
}

Circle.prototype.update = function() {
	// this function should be called to update the position and velocity every necessary frame
	if(!this.movementRestricted) {
		this.accel = this.force.mult(this.invmass);
		this.vel.add(this.accel);
		this.prevpos = createVector(this.pos.x, this.pos.y);
		this.pos.add(this.vel);
		this.force.mult(0);
	}
};

Circle.prototype.updateTrail = function() {
	// this function must be called to draw every necessary frame
	this.trail.push(createVector(this.pos.x,this.pos.y));
}

Circle.prototype.draw = function() {
	//stroke(15);
	fill(this.col.x,this.col.y,this.col.z);
	ellipse(this.pos.x,this.pos.y,2*this.rad,2*this.rad);
};

Circle.prototype.addForce = function(f) {
	this.force.add(f);
};

Circle.prototype.translate = function(d) {
	if(this.movementRestricted == false)
		this.pos.add(d);
};