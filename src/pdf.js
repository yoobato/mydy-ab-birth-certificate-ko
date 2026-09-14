import {PDFDocument,rgb} from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import {koreanDate,validate} from './data.js';
export async function createPdf(data,fontBytes){
 validate(data);
 if(!fontBytes){const response=await fetch(`${import.meta.env.BASE_URL}fonts/NanumGothic-Regular.ttf`);if(!response.ok)throw new Error('한글 글꼴을 불러오지 못했습니다.');fontBytes=await response.arrayBuffer();}
 const pdf=await PDFDocument.create();pdf.registerFontkit(fontkit);const font=await pdf.embedFont(fontBytes,{subset:false});pdf.setTitle('출생증명서 한글 번역문');pdf.setCreator('Alberta Birth KO');
 const page=pdf.addPage([612,792]);const ink=rgb(.12,.16,.18),line=rgb(.75,.78,.77),wash=rgb(.95,.96,.95);
 const text=(value,x,y,size=11,maxWidth=500)=>{value=String(value||'');const needed=font.widthOfTextAtSize(value,size);if(needed>maxWidth)size=Math.max(7,size*maxWidth/needed);if(font.widthOfTextAtSize(value,size)>maxWidth)throw new Error('입력 내용이 너무 깁니다.');page.drawText(value,{x,y,size,font,color:ink});};
 const rule=(x1,y1,x2,y2)=>page.drawLine({start:{x:x1,y:y1},end:{x:x2,y:y2},thickness:.5,color:line});
 page.drawRectangle({x:180,y:720,width:394,height:40,borderColor:ink,borderWidth:1});
 text('출 생',344,732,22);
 text('알버타',140,676,29);text('캐나다',190,651,15);
 text('출생증명서',38,604,20);
 text(data.formCode,38,554,9,150);
 text(data.registrarKo,220,564,11,165);text('인구동태통계 등록관',220,545,10,165);
 text('캐나다 알버타주 에드먼턴에',399,568,9,175);text('등록된 출생기록에서',399,553,9,175);text('추출된 증명서',399,538,9,175);
 const rows=[['성',data.surname],['이름',data.given],['생년월일',koreanDate(data.birth),'성별',data.sex==='M'?'남':'여'],['출생지',data.place],['등록번호',data.registration],['등록일',koreanDate(data.registered),'발급일',koreanDate(data.issued)],['모 성명',data.parent1],['출생지',data.parent1Place],['부 성명',data.parent2],['출생지',data.parent2Place]];
 const xs=[38,129,333,402,557],rowHeight=35,top=512;
 rows.forEach((r,i)=>{const y=top-i*rowHeight;const end=r.length===4?557:333;page.drawRectangle({x:38,y:y-rowHeight,width:91,height:rowHeight,color:wash});if(r.length===4)page.drawRectangle({x:333,y:y-rowHeight,width:69,height:rowHeight,color:wash});rule(38,y,end,y);rule(38,y-rowHeight,end,y-rowHeight);for(const x of (r.length===4?xs:xs.slice(0,3)))rule(x,y,x,y-rowHeight);text(r[0],47,y-23,10,74);text(r[1],139,y-23,12,184);if(r.length===4){text(r[2],343,y-23,10,50);text(r[3],412,y-23,11,135);}});
 const serial=String(data.serial||'');let letterSize=10;const spacing=4;const width=font.widthOfTextAtSize(serial,letterSize)+Math.max(0,serial.length-1)*spacing;
 // Keep tracking visible while fitting long document numbers within the page.
 const scale=Math.min(1,220/Math.max(1,width));let x=557-width*scale;
 for(const char of serial){text(char,x,140,letterSize*scale,220);x+=(font.widthOfTextAtSize(char,letterSize)+spacing)*scale;}
 const y=55,height=38;page.drawRectangle({x:38,y,width:91,height,color:wash});
 for(const edge of [[38,y,333,y],[38,y+height,333,y+height],[38,y,38,y+height],[129,y,129,y+height],[333,y,333,y+height]])rule(...edge);
 text('번역자',47,y+13,11);text(data.translator,139,y+13,12,125);
 page.drawText('(인)',{x:286,y:y+13,size:12,font,color:rgb(.65,.65,.65)});
 return pdf.save();
}
