"use server";
import { createClient } from "@/lib/supabase/server";
export type LoginResult={ok:boolean;stage:"email"|"code"|"done";message:string};
export async function requestOtp(email:string):Promise<LoginResult>{
 const normalized=email.trim().toLowerCase(); if(!normalized.includes("@")) return {ok:false,stage:"email",message:"Informe um e-mail válido."};
 const supabase=await createClient(); const {error}=await supabase.auth.signInWithOtp({email:normalized,options:{shouldCreateUser:true}});
 if(error) return {ok:false,stage:"email",message:"Não foi possível enviar o código. Tente novamente."};
 return {ok:true,stage:"code",message:"Código enviado. Verifique sua caixa de entrada."};
}
export async function verifyOtp(email:string,token:string):Promise<LoginResult>{
 const supabase=await createClient(); const {error}=await supabase.auth.verifyOtp({email:email.trim().toLowerCase(),token:token.trim(),type:"email"});
 if(error) return {ok:false,stage:"code",message:"Código inválido ou expirado."};
 const {data:claimed,error:claimError}=await supabase.rpc("claim_authorized_user");
 if(claimError||!claimed){await supabase.auth.signOut();return {ok:false,stage:"email",message:"Este e-mail não está autorizado a administrar o site."};}
 return {ok:true,stage:"done",message:"Acesso autorizado."};
}
