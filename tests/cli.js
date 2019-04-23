import Lab from 'lab'
import { expect } from 'code'
import { handlers } from "../src"
import * as Prompts from "prompts"
import sinon from "sinon"
let lab = (exports.lab = Lab.script())
const { test, experiment } = lab

lab.experiment('CLI', () => {
  
  lab.experiment("_sample", () => {

    let fnc = handlers._sample

    // before,beforeEach,after,afterEach
    lab.after(function() {
      fnc = null
    })

    test("method exists", () => {
      expect(fnc, "is defined").to.not.be.undefined()
    })
    
    test("should add movie to the end of name", async () => {
      const result = await fnc("Interstellar")
      expect(result).to.equal("Interstellar Movie")
    })

    test("if passed name is null, should error out", async () => {
      await expect(fnc(), "should reject when undefined").to.reject(Error, "name is required")
    })
  })

  lab.experiment("_sample2", () => {
    let fnc = handlers._sample2

    lab.after(() => { fnc = null })

    lab.beforeEach(({context}) => {
      let cache = {}
      context.cache = cache
      cache.promptstub = sinon.stub(Prompts.prompts, "text")
    })

    lab.afterEach(() => {
      sinon.restore()
    })

    test("calls prompt", async ({context: {cache}}) => {
      const { promptstub } = cache

      promptstub.resolves({
        value: "mymovie"
      })

      const result = await fnc()
      expect(promptstub.called, "prompts was called").to.be.true()
      expect(
        promptstub.calledWith({
          type: "text",
          name: "value",
          message: "What's the name of the movie?"
        }),
        "called correctly"
      ).to.be.true()
      expect(result, "returns result of the prompt").to.equal("mymovie")
    })
  })

  // lab.experiment("updatting a movie")

})
