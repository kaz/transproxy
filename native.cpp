#include <node.h>
#include <sys/socket.h>
#include <arpa/inet.h>

#ifdef __linux
#include <linux/netfilter_ipv4.h>
#endif

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Number;
using v8::Exception;
using v8::Value;

void Method(const FunctionCallbackInfo<Value>& args) {
	Isolate* isolate = args.GetIsolate();
	
	if(!args[0]->IsNumber()){
		isolate->ThrowException(Exception::TypeError(String::NewFromUtf8(isolate, "wrong socket")));
		return;
	}
	
	struct sockaddr_in addr;
	
	#ifdef __linux
	
	socklen_t len = sizeof(addr);
	if(getsockopt((int)args[0]->NumberValue(), IPPROTO_IP, SO_ORIGINAL_DST, &addr, &len)){
		isolate->ThrowException(Exception::TypeError(String::NewFromUtf8(isolate, "failed getsockopt")));
		return;
	}
	
	#else
	
	addr.sin_family = AF_INET;
	addr.sin_port = htons(80);
	addr.sin_addr.s_addr = inet_addr("127.0.0.1");
	
	#endif
	
	Local<Object> obj = Object::New(isolate);
	obj->Set(String::NewFromUtf8(isolate, "host"), String::NewFromUtf8(isolate, inet_ntoa(addr.sin_addr)));
	obj->Set(String::NewFromUtf8(isolate, "port"), Number::New(isolate, ntohs(addr.sin_port)));
	
	args.GetReturnValue().Set(obj);
}

void init(Local<Object> exports) {
	NODE_SET_METHOD(exports, "getOriginalDst", Method);
}

NODE_MODULE(native, init)