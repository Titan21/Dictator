  // Imports the Google Cloud client library
  const speech = require('@google-cloud/speech');
  
  // Creates a client
  const client = new speech.SpeechClient();

/**
 * Triggered from a change to a Cloud Storage bucket.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
 exports.helloGCS = (file, context) => {
    console.log(`  Event: ${context.eventId}`);
    console.log(`  Event Type: ${context.eventType}`);
    console.log(`  Bucket: ${file.bucket}`);
    console.log(`  File: ${file.name}`);
    console.log(`  Metageneration: ${file.metageneration}`);
    console.log(`  Created: ${file.timeCreated}`);
    console.log(`  Updated: ${file.updated}`);
    console.log(`  Wooohoo!`);
    quickstart(file.bucket,file.name);
  };
  

  
  async function quickstart(bucket, name) {
    console.log(`  Entered Quickstart with arguments ${bucket} and ${name}!`);
    // The path to the remote LINEAR16 file
    const gcsUri = `gs://${bucket}/${name}`;
  
    // The audio file's encoding, sample rate in hertz, and BCP-47 language code
    const audio = {
      uri: gcsUri,
    };
    const config = {
      encoding: 'MP3',
      sampleRateHertz: 44100,
      languageCode: 'en-US',
    };
    const request = {
      audio: audio,
      config: config,
    };
  
    // Detects speech in the audio file
    console.log(`Submitting request to API`);
    const [operation] = await client.longRunningRecognize(request);
    // Get a Promise representation of the final result of the job
    const [response] = await operation.promise();
    console.log(`Received Response. See Transcription below:`)
    const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
    console.log(`Transcription: ${transcription}`);
  }