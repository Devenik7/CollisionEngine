function Collision () {

}

function CollisionResponse(chk, norm, penetdepth) {
	// this is a class definiton and an instance is returned when the check() function of the collision engine is called.
	// After the collision has ben resolved and velocities have been changed, this object is returned with additional data.
	// if chk = false. Then no collsion has occured. Else collision has occured and the normal and depth of collision is returned as additional data.
	this.check = chk || false;
	this.normal = norm || createVector(0,0);
	this.penetrationdepth = penetdepth || 0;
}

Collision.prototype.check = function(obj1,obj2) {
	// This is the main function that checks for a collision and resolves in case a collision happens.

	// If both are circles
	if(obj1.typ === "Circle" && obj2.typ === "Circle"){
		var normal = p5.Vector.sub(obj2.pos,obj1.pos);
		if(normal.magSq() > (obj1.rad + obj2.rad)*(obj1.rad + obj2.rad))
			return new CollisionResponse(false);
		
		else { 				// Collided. Do Something.
			var penetrationdepth = (obj1.rad + obj2.rad) - normal.mag();
			normal.normalize();
			return this.applyImpulse(obj1, obj2, normal, penetrationdepth);
		}
	}
	// If both are rectangles
	else if (obj1.typ === "Rectangle" && obj2.typ === "Rectangle") {
		// Calculating Overlap on the X-axis and Y-axis and if Overlap is negative on either, can directly deduce that there is no collision
		var xOverlap1 = (obj1.pos.x+obj1.dim.x/2) - (obj2.pos.x-obj2.dim.x/2);
		var xOverlap2 = (obj2.pos.x+obj2.dim.x/2) - (obj1.pos.x-obj1.dim.x/2);
		if(min(xOverlap1, xOverlap2) < 0) return new CollisionResponse(false);

		var yOverlap1 = (obj1.pos.y+obj1.dim.y/2) - (obj2.pos.y-obj2.dim.y/2);
		var yOverlap2 = (obj2.pos.y+obj2.dim.y/2) - (obj1.pos.y-obj1.dim.y/2);
		if(min(yOverlap1, yOverlap2) < 0) return new CollisionResponse(false);

		else { 				// Collided. Do Something.
			var normal;
			// Choosing minimum of the overlaps to determine the Normal
			var penetrationdepth = min(xOverlap1, xOverlap2, yOverlap1, yOverlap2);
			switch (penetrationdepth) {
				case xOverlap1: normal = createVector(1,0); penetrationdepth = xOverlap1; break;
				case xOverlap2: normal = createVector(-1,0); penetrationdepth = xOverlap2; break;
				case yOverlap1: normal = createVector(0,1); penetrationdepth = yOverlap1; break;
				case yOverlap2: 
				default: normal = createVector(0,-1); penetrationdepth = yOverlap2; break;
			}
			return this.applyImpulse(obj1, obj2, normal, penetrationdepth);
		}
	}
	// If one is a circle and the other is a Rectangle
	else if (obj1.typ === 'Circle' && obj2.typ === 'Rectangle' || obj1.typ === 'Rectangle' && obj2.typ === 'Circle') {
		if(obj2.typ === 'Circle'){
			var temp = obj1;
			obj1 = obj2;
			obj2 = temp;
		}
		// Finding the closest point on the Rectangle to the centre of the Circle.
		// I'm surprised how easy it is and at the same time disgusted as to why it didn't occur to me -_-
		var closest = createVector(obj1.pos.x, obj1.pos.y);
		closest.x = max((obj2.pos.x-obj2.dim.x/2), min(closest.x, (obj2.pos.x-obj2.dim.x/2)+obj2.dim.x));
		closest.y = max((obj2.pos.y-obj2.dim.y/2), min(closest.y, (obj2.pos.y-obj2.dim.y/2)+obj2.dim.y));
		var normal = p5.Vector.sub(closest, obj1.pos);
		if(normal.magSq() > (obj1.rad*obj1.rad))
			return new CollisionResponse(false);

		else {				// Collided. Do Something.
			var penetrationdepth = obj1.rad - normal.mag();
			normal.normalize();
			return this.applyImpulse(obj1, obj2, normal, penetrationdepth);
		}
		// NOTE : We have ignored the case where the centre of the circle is inside the rectangle coz that case almost never occurs.
		//		  But it's better to look into that case too.
	}
};

Collision.prototype.applyImpulse = function(obj1, obj2, normal, penetrationdepth) {
	// This functions applies the impulse on both the objects
	var relativeVelAlongNormal = p5.Vector.sub(obj2.vel,obj1.vel).dot(normal);
	if (relativeVelAlongNormal > 0) 			// this condition is here to neglect objects that are travelling away from each other
		return new CollisionResponse(false);   // this arises when a collision is resolved but they already penetrated waaay too much and 
								  			  // can't get away from each other
	var e = min(obj1.elast,obj2.elast);
	var j = (1+e)*relativeVelAlongNormal;
	j /= (obj1.invmass + obj2.invmass);
	var impulse = p5.Vector.mult(normal,j);

	obj1.vel.add(p5.Vector.mult(impulse,obj1.invmass));
	obj2.vel.sub(p5.Vector.mult(impulse,obj2.invmass));

	return this.applyPositionalCorrection(obj1, obj2, normal, penetrationdepth);
};

Collision.prototype.applyPositionalCorrection = function(obj1, obj2, normal, penetrationdepth) {
	// This function applies approximate positional correction
	var percent = 0.8;
	var correction;
	if(obj1.movementRestricted == true || obj2.movementRestricted == true) {
		// If one of the objects is Movement Restricted, then the moving object should completely be out of the stationary object
		correction = p5.Vector.mult(normal, penetrationdepth / (obj1.invmass + obj2.invmass));
	}
	else {
		// If none of the objects are Movement Restricted, then both the objects must move only partly away for realistic nature
		correction = p5.Vector.mult(normal, penetrationdepth * percent / (obj1.invmass + obj2.invmass));
	}
	if(obj1.movementRestricted != true) {
		obj1.translate(p5.Vector.mult(correction, -1 * obj1.invmass))
	}
	if(obj2.movementRestricted != true) {
		obj2.translate(p5.Vector.mult(correction, obj2.invmass));
	}
	// A Response Object is returned with additional data
	return new CollisionResponse(true, normal, penetrationdepth);
};