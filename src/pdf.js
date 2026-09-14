import {PDFDocument,rgb} from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import {koreanDate,validate} from './data.js';
export async function createPdf(data,fontBytes){
 validate(data);
 if(!fontBytes){const response=await fetch(`${import.meta.env.BASE_URL}fonts/NanumGothic-Regular.ttf`);if(!response.ok)throw new Error('한글 글꼴을 불러오지 못했습니다.');fontBytes=await response.arrayBuffer();}
 const pdf=await PDFDocument.create();pdf.registerFontkit(fontkit);const font=await pdf.embedFont(fontBytes,{subset:false});pdf.setTitle('출생증명서 한글 번역문');pdf.setCreator('Alberta Birth KO');
 const page=pdf.addPage([595.28,841.89]);const ink=rgb(.12,.16,.18),line=rgb(.75,.78,.77),wash=rgb(.95,.96,.95);
 const text=(value,x,y,size=11,maxWidth=500)=>{value=String(value||'');const needed=font.widthOfTextAtSize(value,size);if(needed>maxWidth)size=Math.max(7,size*maxWidth/needed);if(font.widthOfTextAtSize(value,size)>maxWidth)throw new Error('입력 내용이 너무 깁니다.');page.drawText(value,{x,y,size,font,color:ink});};
 const rule=(x1,y1,x2,y2)=>page.drawLine({start:{x:x1,y:y1},end:{x:x2,y:y2},thickness:.5,color:line});
 const center=(value,y,size=11)=>text(value,(595.28-font.widthOfTextAtSize(value,size))/2,y,size);
 page.drawRectangle({x:38,y:758,width:519,height:43,borderColor:ink,borderWidth:1});center('출 생',772,23);
 center('알버타',714,29);center('캐나다',687,15);
 text('출생증명서',38,638,20);text('한글 번역문',465,640,10,95);
 text(data.formCode,38,594,9,150);
 text(data.registrarKo,220,605,11,165);text('인구동태통계 등록관',220,586,10,165);
 text('캐나다 알버타주 에드먼턴에',399,609,9,160);text('등록된 출생기록에서',399,594,9,160);text('추출된 증명서',399,579,9,160);
 const rows=[['성',data.surname],['이름',data.given],['생년월일',koreanDate(data.birth),'성별',data.sex==='M'?'남':'여'],['출생지',data.place],['등록번호',data.registration],['등록일',koreanDate(data.registered),'발급일',koreanDate(data.issued)],['부모 성명 (1)',data.parent1],['출생지',data.parent1Place],['부모 성명 (2)',data.parent2],['출생지',data.parent2Place]];
 const xs=[38,129,333,402,557],rowHeight=36,top=548;
 rows.forEach((r,i)=>{const y=top-i*rowHeight;const end=r.length===4?557:333;page.drawRectangle({x:38,y:y-rowHeight,width:91,height:rowHeight,color:wash});if(r.length===4)page.drawRectangle({x:333,y:y-rowHeight,width:69,height:rowHeight,color:wash});rule(38,y,end,y);rule(38,y-rowHeight,end,y-rowHeight);for(const x of (r.length===4?xs:xs.slice(0,3)))rule(x,y,x,y-rowHeight);text(r[0],47,y-23,10,74);text(r[1],139,y-23,12,184);if(r.length===4){text(r[2],343,y-23,10,50);text(r[3],412,y-23,11,135);}});
 text(data.serial,374,169,10,180);
 text('번역자',38,104,11);text(data.translator,110,104,13,190);text('서명',348,104,11);rule(384,98,553,98);
 return pdf.save();
}
