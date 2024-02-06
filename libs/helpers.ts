import {Price} from "@/types";

export const getURL = () =>{
  let url = process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.NEXT_PUBLIC_VERCEL_URL ??
  'http://localhost:3000/';

  url = url.includes('http') ? url : `https://${url}`;
  url = url.charAt(url.length-1)==='/'? url:`${url}/`;

  return url
};

export const postData = async({
  url, data
}:{
  url:string,
  data?: {price: Price}
})=>{
  
  const resp: Response = await fetch(url,{
    method: 'POST',
    headers: new Headers({'Content-Type':'application/json'}),
    credentials:'same-origin',
    body: JSON.stringify(data)
  });
  if(!resp.ok){
    console.log('Error in POST',{url, data, resp});
    throw new Error(resp.statusText);

  }
  return resp.json();
};

export const toDateTime = (secs: number) => {

  let t = new Date('1970-01-01T00:30:00Z');
  t.setSeconds(secs);
  return t;
}
