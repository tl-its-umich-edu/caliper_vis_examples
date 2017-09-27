# Caliper Visualization Examples

1. Extract from caliper data a subset via jq
```bash
cat  pr_extract.jsonl | jq  -s  '[.[] | select(.action=="http://purl.imsglobal.org/vocab/caliper/v1/action#Completed") |  {problem_set: .object.isPartOf.name, problem: .object.name, answerCorrect: .generated.extensions.isStudentAnswerCorrect, time: .generated.attempt.duration, actor: .actor.name, start: .generated.attempt.startedAtTime, end:  .generated.attempt.endedAtTime}]' > test.json
```
2. This will create a slimmer array from the Caliper jsonl with objects such as

```json
{
    "problem_set": "Problem Set Name",
    "problem": "Problem Name",
    "answerCorrect": "true",
    "time": "PT15S",
    "actor": "<actor_name>",
    "start": "2016-05-05T04:31:33.000Z",
    "end": "2016-05-05T04:31:48.000Z"
  }
```
3. Run an anonymizer throught the data and make it available to the js.
3. The js files manipulate this anonymzed array and serve the result to an NVD3 chart

Note: need to run a web server to take care of cross origin requests.

A simple one is `python -m SimpleHTTPServer 8000`
