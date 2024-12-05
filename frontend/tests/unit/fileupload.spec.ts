import { mount } from "@vue/test-utils";
import { expect } from "chai";
import sinon from "sinon";
import axios from "axios";
import FileUploadComponent from "@/components/FileUploadComponent.vue";

describe("FileUploadComponent.vue", () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(FileUploadComponent);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it("should display an error message when no file is selected", async () => {
    await wrapper.vm.handleSubmit();
    expect(wrapper.vm.errorMessage).to.equal("Please select a file to upload.");
  });

  it("should display an error message for invalid file type", async () => {
    const invalidFile = new File([""], "test.txt", { type: "text/plain" });
    wrapper.vm.handleFileChange({ target: { files: [invalidFile] } });
    expect(wrapper.vm.errorMessage).to.equal(
      "Invalid file type. Please upload an HTML file."
    );
  });

  it("should display an error message for file size exceeding limit", async () => {
    const largeFile = new File(["a".repeat(6 * 1024 * 1024)], "large.html", {
      type: "text/html",
    });
    wrapper.vm.handleFileChange({ target: { files: [largeFile] } });
    expect(wrapper.vm.errorMessage).to.equal(
      "File is too large. Please upload a file under 5MB."
    );
  });

  it("should set selectedFile when a valid file is uploaded", async () => {
    const validFile = new File(["<html></html>"], "test.html", {
      type: "text/html",
    });
    wrapper.vm.handleFileChange({ target: { files: [validFile] } });
    expect(wrapper.vm.selectedFile).to.equal(validFile);
    expect(wrapper.vm.errorMessage).to.be.null;
  });

  it("should reset the form correctly", async () => {
    const validFile = new File(["<html></html>"], "test.html", {
      type: "text/html",
    });
    wrapper.vm.handleFileChange({ target: { files: [validFile] } });
    await wrapper.vm.resetForm();
    expect(wrapper.vm.selectedFile).to.be.null;
    expect(wrapper.vm.errorMessage).to.be.null;
    expect(wrapper.vm.results).to.deep.equal([]);
    expect(wrapper.vm.$refs.fileInput.value).to.equal("");
  });

  it("should handle file upload and display results", async () => {
    const validFile = new File(["<html></html>"], "test.html", {
      type: "text/html",
    });
    wrapper.vm.handleFileChange({ target: { files: [validFile] } });
    const axiosPostStub = sinon.stub(axios, "post").resolves({
      data: {
        data: {
          issues: [
            {
              type: "error",
              element: "<div>",
              message: "Example error",
              rule_metadata: "example-rule",
            },
          ],
          score: 75,
        },
      },
    });

    await wrapper.vm.handleSubmit();
    expect(wrapper.vm.results).to.have.lengthOf(1);
    expect(wrapper.vm.scores).to.equal(75);
    expect(wrapper.vm.errorMessage).to.be.empty;
    axiosPostStub.restore();
  });
});
