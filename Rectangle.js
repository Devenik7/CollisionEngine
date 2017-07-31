function Rectangle (pos, dim, vel, col, mass, e, rest) {
	this.pos = pos || createVector(random(50,1000),random(50,500));
	this.dim = dim || createVector(floor(random(30,50)),floor(random(30,50)));
	this.vel = vel ||createVector(floor(random(-5,5)),floor(random(-5,5)));
	this.col = col || createVector(random(0,255),255,50);
	this.mass = mass || (this.dim.x + this.dim.y) / 2;
	this.invmass = 1/this.mass;
	this.elast = (e == null) ? 0.95 : e;
	this.typ = "Rectangle";
	this.movementRestricted = rest || false;
	this.accel = createVector(0,0);
	this.force = createVector(0,0);
	this.trail = [];
};

Rectangle.prototype.update = function() {
	//console.log(this.movementRestricted);
	if(!this.movementRestricted) {
		this.accel = this.force.mult(this.invmass);
		this.vel.add(this.accel);
		this.pos.add(this.vel);
		this.force.mult(0);
		// trail effect		// NOTE :  we have found that trailing can just be acheived by continously drawing a backgorund with lesser alpha, its not perfect but does the simple job
		//this.trail.push(createVector(this.pos.x,this.pos.y));
		//if(this.trail.length > 15)
		//	this.trail.splice(0,1);	
	}
};

Rectangle.prototype.draw = function() {
	stroke(0);
	fill(this.col.x,this.col.y,this.col.z);
	rect(this.pos.x-this.dim.x/2,this.pos.y-this.dim.y/2,this.dim.x,this.dim.y);
	// trail effect	
	for (var i = 0; i < this.trail.length-1; i+=3) {
		noStroke();
		fill(this.col.x, this.col.y, this.col.z, 255*(i+1)/this.trail.length);
		rect(this.trail[i].x-((this.dim.x)*(i+1)/this.trail.length)/2, this.trail[i].y-((this.dim.y)*(i+1)/this.trail.length)/2, (this.dim.x)*(i+1)/this.trail.length, (this.dim.y)*(i+1)/this.trail.length);
	}
};

Rectangle.prototype.addForce = function(f) {
	this.force.add(f);
};

Rectangle.prototype.translate = function(d) {
	if(this.movementRestricted == false)
		this.pos.add(d);
}