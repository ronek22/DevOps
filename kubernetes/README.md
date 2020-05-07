## ReplicaSet

Pozwala replikować [pody](pod-definition.yml) (zmienia się liczba podów), [plik konfiguracyjnym](rs-def.yml)

Scale replicaset, for example when you assume that traffic would be higher 

*Using commandline*

`kubectl scale --replicas=n replicaset myapp-replicaset`

*Using file definition change*

`kubectl replace -f rs-def.yml`

*Change default context to our namespace*
`kubectl config set-context $(kubectl config current-context) --namespace=my-dev`
