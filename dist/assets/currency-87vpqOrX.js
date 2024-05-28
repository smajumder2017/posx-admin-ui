function c(r,t={}){const{locale:e="en-IN",currency:n="INR"}=t;return new Intl.NumberFormat(e,{currency:n,style:"currency",maximumFractionDigits:2}).format(r)}export{c as f};
