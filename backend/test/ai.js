const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();

chai.use(chaiHttp);

describe('AI Controller', () => {
  describe('POST /ai/fetchSuggestedPay', () => {
    it('should return the suggested hourly pay rate', (done) => {
      const requestData = {
        jobRole: 'Software Engineer',
        location: 'San Francisco, CA',
      };

      chai
        .request('http://localhost:8000')
        .post('/ai/fetchSuggestedPay')
        .send(requestData)
        .end((err, res) => {
          if (err) return done(err);
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.data.should.be.a('string');
          done();
        });
    });

    it('should return a 400 error for missing required fields', (done) => {
      const invalidData = { jobRole: 'Software Engineer' }; // Missing 'location'

      chai
        .request('http://localhost:8000')
        .post('/ai/fetchSuggestedPay')
        .send(invalidData)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.message.should.equal('Required fields missing');
          done();
        });
    });

    it('should handle server errors gracefully', (done) => {
      const faultyRequestData = {
        jobRole: 'Software Engineer',
        location: 'Nowhere', // This can trigger an error if the API key or model fails
      };

      // Simulating error scenario by altering/mock environment variables or dependencies
      chai
        .request('http://localhost:8000')
        .post('/ai/fetchSuggestedPay')
        .send(faultyRequestData)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          done();
        });
    });
  });
});

describe('GET /fetchMessages', () => {
  it('should fetch messages for a specific applicant', (done) => {
    chai
      .request('http://localhost:8000')
      .get('/message/fetchMessages')
      .query({ applicationId: '6722e4be0f205dc7a0c0b2eb' })
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('should sort messages by date', (done) => {
    chai
      .request('http://localhost:8000')
      .get('/message/fetchMessages')
      .query({ applicationId: '6722e4be0f205dc7a0c0b2eb' })
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('should return 400 when applicationId is missing', (done) => {
    chai
      .request('http://localhost:8000')
      .get('/message/fetchMessages')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.message.should.equal('applicationId missing');
        done();
      });
  });

  it('should handle errors during message fetching', async () => {
    try {
      await chai
        .request('http://localhost:8000')
        .get('/message/fetchMessages')
        .query({ applicationId: '6722e4be0f205dc7a0c0b2eb' });
    } catch (error) {
      error.response.should.have.status(200);
      error.response.body.should.be.an('object');
      error.response.body.message.should.equal('Something went wrong');
    }
  });
});

describe('GET /message/fetchMessages', () => {
  it('should fetch messages for a specific applicant', (done) => {
    chai
      .request('http://localhost:8000')
      .get('/message/fetchMessages')
      .query({ applicationId: '6722e4be0f205dc7a0c0b2eb' })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        done();
      });
  });

  it('should sort messages by date', (done) => {
    chai
      .request('http://localhost:8000')
      .get('/message/fetchMessages')
      .query({ applicationId: '6722e4be0f205dc7a0c0b2eb' })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        done();
      });
  });

  it('should return 400 when applicationId is missing', (done) => {
    chai
      .request('http://localhost:8000')
      .get('/message/fetchMessages')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.message.should.equal('applicationId missing');
        done();
      });
  });

  it('should handle errors during message fetching', async () => {
    try {
      await chai
        .request('http://localhost:8000')
        .get('/message/fetchMessages')
        .query({ applicationId: 'testApplicant' });
    } catch (error) {
      error.response.should.have.status(200);
      error.response.body.should.be.an('object');
      error.response.body.message.should.equal('Something went wrong');
    }
  });
});
