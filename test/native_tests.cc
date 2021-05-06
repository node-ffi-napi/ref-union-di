#include <stdlib.h>
#include "napi.h"

#ifdef _WIN32
  #define __alignof__ __alignof
#endif

using namespace Napi;

namespace {

typedef union _test1 {
  char a;
  short b;
} test1;

typedef union _test2 {
  char a;
  int b;
} test2;

typedef union _test3 {
  char a;
  short b;
  int c;
} test3;

typedef union _test4 {
  struct {
    char a;
    short b;
    int c;
  } a;
  int b;
} test4;

typedef union _test5 {
  double a;
  char b;
} test5;

typedef union _test6 {
  test1 a;
  char b;
} test6;

typedef union _test7 {
  char a;
  char b[2];
  short c;
  char d;
} test7;

typedef union _test8 {
  int a;
  double b;
  int c;
} test8;


Object Initialize(Env env, Object exports) {

  exports.Set("test1 sizeof", sizeof(test1));
  exports.Set("test1 alignof", __alignof__(test1));
  exports.Set("test1 offsetof a", offsetof(test1, a));
  exports.Set("test1 offsetof b", offsetof(test1, b));

  exports.Set("test2 sizeof", sizeof(test2));
  exports.Set("test2 alignof", __alignof__(test2));
  exports.Set("test2 offsetof a", offsetof(test2, a));
  exports.Set("test2 offsetof b", offsetof(test2, b));

  exports.Set("test3 sizeof", sizeof(test3));
  exports.Set("test3 alignof", __alignof__(test3));
  exports.Set("test3 offsetof a", offsetof(test3, a));
  exports.Set("test3 offsetof b", offsetof(test3, b));
  exports.Set("test3 offsetof c", offsetof(test3, c));

  exports.Set("test4 sizeof", sizeof(test4));
  exports.Set("test4 alignof", __alignof__(test4));
  exports.Set("test4 offsetof a", offsetof(test4, a));
  exports.Set("test4 offsetof b", offsetof(test4, b));

  exports.Set("test5 sizeof", sizeof(test5));
  exports.Set("test5 alignof", __alignof__(test5));
  exports.Set("test5 offsetof a", offsetof(test5, a));
  exports.Set("test5 offsetof b", offsetof(test5, b));

  exports.Set("test6 sizeof", sizeof(test6));
  exports.Set("test6 alignof", __alignof__(test6));
  exports.Set("test6 offsetof a", offsetof(test6, a));
  exports.Set("test6 offsetof b", offsetof(test6, b));

  exports.Set("test7 sizeof", sizeof(test7));
  exports.Set("test7 alignof", __alignof__(test7));
  exports.Set("test7 offsetof a", offsetof(test7, a));
  exports.Set("test7 offsetof b", offsetof(test7, b));
  exports.Set("test7 offsetof c", offsetof(test7, c));
  exports.Set("test7 offsetof d", offsetof(test7, d));

  exports.Set("test8 sizeof", sizeof(test8));
  exports.Set("test8 alignof", __alignof__(test8));
  exports.Set("test8 offsetof a", offsetof(test8, a));
  exports.Set("test8 offsetof b", offsetof(test8, b));
  exports.Set("test8 offsetof c", offsetof(test8, c));

  return exports;
}

} // anonymous namespace

NODE_API_MODULE(native_tests, Initialize);
