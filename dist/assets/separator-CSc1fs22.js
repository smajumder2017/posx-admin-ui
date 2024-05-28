import{r as i,aa as p,_ as $,j as u,a as v}from"./index-kz_KmYqn.js";const c="horizontal",x=["horizontal","vertical"],s=i.forwardRef((e,r)=>{const{decorative:t,orientation:a=c,...o}=e,n=d(a)?a:c,l=t?{role:"none"}:{"aria-orientation":n==="vertical"?n:void 0,role:"separator"};return i.createElement(p.div,$({"data-orientation":n},l,o,{ref:r}))});s.propTypes={orientation(e,r,t){const a=e[r],o=String(a);return a&&!d(a)?new Error(m(o,t)):null}};function m(e,r){return`Invalid prop \`orientation\` of value \`${e}\` supplied to \`${r}\`, expected one of:
  - horizontal
  - vertical

Defaulting to \`${c}\`.`}function d(e){return x.includes(e)}const f=s,h=i.forwardRef(({className:e,orientation:r="horizontal",decorative:t=!0,...a},o)=>u.jsx(f,{ref:o,decorative:t,orientation:r,className:v("shrink-0 bg-border",r==="horizontal"?"h-[1px] w-full":"h-full w-[1px]",e),...a}));h.displayName=f.displayName;export{h as S};
