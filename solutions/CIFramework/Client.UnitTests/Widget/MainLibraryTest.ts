/// <reference path="../../Client/Widget/MainLibrary.ts" />
/// <reference path="../../Client/PostMsgWrapper.ts" />

namespace Microsoft.CIFramework.Tests
{
	const expect = chai.expect;
	const src = Microsoft.CIFramework;
	const postMsgWrapper = postMessageNamespace.postMsgWrapper;

	describe("SetClickToAct", () =>
	{
		// let wrapper = new postMsgWrapper([]);
		// let postMsgStub: Sinon.SinonStub = null;

		// beforeEach(() =>
		// {
		// 	postMsgStub = sinon.stub(wrapper, "postMsg");
		// });
		// afterEach(() =>
		// {
		// 	postMsgStub.restore();
		// });

		// it("should return resolved promise when postMsg suceeds", () =>
		// {
		// 	const payload : postMessageNamespace.IRequestMessageType = {
		// 			messageType: "setClickToAct",
		// 			messageData : { ["value"] : true }
		// 		};
		// 	postMsgStub.returns(Promise.resolve());

		// 	const promise = src.setClickToAct(true);

		// 	return promise.then(
		// 		() =>
		// 		{
		// 			expect(postMsgStub.calledOnce).to.be.true;
		// 			expect(postMsgStub.args[1]).to.be.deep.equal(payload);
		// 		},
		// 		() =>
		// 		{
		// 			expect.fail("Promise was rejected when it was expected to be resolved.");
		// 		});
		// });
		// it("should return rejected promise when postMsg fails", () =>
		// {
		// 	const payload : postMessageNamespace.IRequestMessageType = {
		// 			messageType: "setClickToAct",
		// 			messageData : { ["value"] : false }
		// 		};

		// 	sinon.spy('postMessage');
		// 	postMsgStub.returns(Promise.reject(new Error("Error occurred.")));

		// 	const promise = src.setClickToAct(false);

		// 	return promise.then(
		// 		function()
		// 		{
		// 			expect.fail("Promise was resolved when it was expected to be rejected.");
		// 		},
		// 		function(error: Error)
		// 		{
		// 			expect(postMsgStub.calledOnce).to.be.true;
		// 			expect(postMsgStub.args[1]).to.be.deep.equal(payload);
		// 			expect(error).to.be.not.null.and.to.be.deep.equal(new Error("Error occurred."));
		// 		});
		// });
	});
}