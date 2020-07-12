# streamsets_orchestrator
  built upon latest versions of react(16), webpack(4) and babel(7)
  To get started, 
    1) clone the repo
    2) do "npm install"
    3) in terminal you can choose to
      3.1) build dist file by running "npm run create"
      3.2) run webpack server using "npm start"
      
  Provides:
    1) All the pipelines + their status (polling to backend) + easy toggle to turn on/off individual pipeline.
    2) Detailed view of pipeline (coming soon).
    3) Create a new topology (dependency of pipelines on one another & time), using drag&drop. Also define a threshold for each pipeline in a topology.
