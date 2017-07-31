function Rectangle (pos, dim, vel, col, mass, e, rest) {
	this.pos = pos || createVector(random(50,1000),random(50,500)); // compulsory
	this.dim = dim || createVector(floor(random(30,50)),floor(random(30,50))); // compulsory
	this.vel = vel ||createVector(floor(random(-5,5)),floor(random(-5,5))); // compulsory
	this.col = col || createVector(random(0,255),255,50);
	this.mass = mass || (this.dim.x + this.dim.y) / 2; // compulsory
	this.invmass = 1/this.mass; // compulsory
	this.elast = (e == null) ? 0.95 : e; // compulsory
	this.typ = "Rectangle"; // compulsory
	this.movementRestricted = rest || false; // compulsory
	this.accel = createVector(0,0); // compulsory
	this.force = createVector(0,0); // compulsory
};

Rectangle.prototype.update = function() {
	// this function should be called to update the position and velocity every necessary frame
	if(!this.movementRestricted) {
		this.accel = this.force.mult(this.invmass);
		this.vel.add(this.accel);
		this.pos.add(this.vel);
		this.force.mult(0);
	}
};

Rectangle.prototype.draw = function() {
	// this function must be called to draw every necessary frame
	stroke(0);
	fill(this.col.x,this.col.y,this.col.z);
	rect(this.pos.x-this.dim.x/2,this.pos.y-this.dim.y/2,this.dim.x,this.dim.y);
};

Rectangle.prototype.addForce = function(f) { // compulsory
	this.force.add(f);
};

Rectangle.prototype.translate = function(d) { // compulsory
	if(this.movementRestricted == false)
		this.pos.add(d);
}