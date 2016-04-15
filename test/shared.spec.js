var expect = require("chai").expect;

var shared = require("../lib/shared");

/* quality tests right here! */
describe("Shared library", function () {
  describe("create database", () => {
    it("doesn't explode", function () {
      shared.create(__dirname + "/default");
    });
  });

  describe("drop database", () => {
    it("doesn't explode", function () {
      shared.create(__dirname + "/default");
    });
  });
});