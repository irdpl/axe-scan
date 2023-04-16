# axe-scan: Testowanie dostępności wielu stron internetowych

[![CodeQL](https://github.com/ttsukagoshi/axe-scan/actions/workflows/codeql.yml/badge.svg)](https://github.com/ttsukagoshi/axe-scan/actions/workflows/codeql.yml) [![Lint Code Base](https://github.com/ttsukagoshi/axe-scan/actions/workflows/linter.yml/badge.svg)](https://github.com/ttsukagoshi/axe-scan/actions/workflows/linter.yml) [![npm version](https://img.shields.io/npm/v/axe-scan.svg?style=flat-square")](https://www.npmjs.com/package/axe-scan) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Narzędzie CLI do testowania dostępności stron internetowych na wielu stronach internetowych na podstawie listy adresów URL w pliku tekstowym. Działa na Node.js i używa [axe-core](https://github.com/dequelabs/axe-core) and [Puppeteer](https://github.com/puppeteer/puppeteer) jako silniki do testowania i przeglądania.

---


## Podstawowa idea

Dostępność strony internetowej to nie tylko kwestia sprawiedliwości społecznej i zgodności z prawem; dostępność ma fundamentalne znaczenie dla rozwoju i utrzymania strony zorientowanej na użytkownika. Ulepszone doświadczenie użytkownika będzie prawdopodobnie preferowane przez wyszukiwarki takie jak Google, co powinno być wskazówką dla członków zarządu organizacji, którzy są mniej zainteresowani tym tematem.

Dostępność stron internetowych jest często przywoływana w kontekście odpowiedzialności projektantów i programistów, i rzeczywiście, [Wytyczne dla dostępności treści internetowych (WCAG)](https://www.w3.org/WAI/standards-guidelines/wcag/) same stwierdzają, że są one przeznaczone dla:

> - Twórcy treści internetowych (autorzy stron, projektanci witryn itp.)
> - twórców narzędzi do tworzenia stron internetowych
> - Twórców narzędzi do oceny dostępności stron internetowych
> - innych osób, które chcą lub potrzebują standardu dostępności stron internetowych, w tym dostępności mobilnej
>
> (_Dla kogo jest WCAG_ [WCAG 2.0 Overview](https://www.w3.org/WAI/standards-guidelines/wcag/))

Patrząc jednak nieco głębiej na faktyczną treść WCAG, można zauważyć, że KAŻDY członek osób związanych z rozwojem i utrzymaniem strony internetowej, nie tylko programiści i inżynierowie, muszą być świadomi wymagań, aby osiągnąć pewien poziom dostępności i utrzymać ten poziom. Axe-scan ma na celu zapewnienie wspólnej podstawy dyskusji w celu poprawy dostępności strony internetowej między specjalistami technicznymi i innymi członkami, którzy są mniej zaznajomieni z WCAG poprzez następujące funkcje:

- **Używa axe-core.** Otwarty silnik testowania dostępności [axe-core](https://github.com/dequelabs/axe-core) dostarczony przez Deque Systems, Inc. jest jednym z wiodących silników testowych na świecie. Narzędzia wykorzystujące ten silnik do wspomagania każdego etapu tworzenia stron internetowych są liczne i w większości darmowe. Takie wyniki testów będą zgodne z axe-scan tak długo jak będą używać axe-core. To powszechne użycie axe-core może być oszczędnością czasu zarówno dla dewelopera jak i klienta; deweloperzy mogą przestać się martwić o wprowadzanie zmian w projekcie strony w ostatniej chwili.
- **Testuje wiele stron internetowych jednocześnie.** Na świecie jest mnóstwo rozszerzeń przeglądarki i innych narzędzi do testowania dostępności, ale (co zaskakujące) niewiele z nich potrafi testować wiele stron jednocześnie. W axe-scan wystarczy przygotować plik tekstowy z listą adresów URL, aby przeprowadzić test.
- **Wyniki w postaci CSV.** Wyniki testów można łatwo zapisać w postaci pliku CSV i udostępnić swojemu zespołowi za pomocą aplikacji arkusza kalkulacyjnego w celu omówienia elementów wymagających działania.
- **Lista umożliwiająca powtarzanie testów.** Niektóre wyniki axe-core są oznaczone jako `niekompletne` (`incomplete`), co odnosi się do elementów HTML, których axe-core nie mógł mechanicznie określić jako `spełnienie` (`passes`) lub `naruszenie` (`violations`) reguł. Te `niekompletne` (`incomplete`) wyniki mogą zawierać elementy, które nie wymagają dalszego działania. Aby uniknąć powtarzania się takich elementów w wynikach, axe-scan dostarcza opcję definiowania listy elementów jako _`allowlist`_.
- **Lokalizacje dostępne w axe-core są odzwierciedlone w danych wyjściowych.** axe-core jest dostarczany z utrzymywanym przez społeczność zestawem lokalizacji ([Supported Locales | axe-core](https://github.com/dequelabs/axe-core#supported-locales)). Możesz łatwo zmienić język wyników axe-scan na dowolną z lokalizacji obsługiwanych w axe-core.
- **Tworzenie podsumowanego raportu opartego na kryteriach sukceu WCAG.** Podczas gdy axe-core odnosi się do kryteriów sukcesu WCAG (SC) w swoich danych wyjściowych, sam test jest przeprowadzany w oparciu o oryginalny zestaw reguł axe-core. Aby zobaczyć jak zestaw stron internetowych przeszedł każde z kryteriów sukcesu WCAG wspieranych przez axe-core, axe-scan axe-scan może dostarczyć raport podsumowujący pogrupowany według kryteriów sukcesu.


## Testowanie dostępności stron internetowych: podstawowy tok pracy

Ta sekcja przedstawia podstawowy tok testowania dostępności stron internetowych przy użyciu axe-scan. Zobacz późniejsze sekcje, aby poznać szczegóły.

### 1. Zainstaluj axe-scan

Przeczytaj część [Instalacja](#instalacja).

### 2. Zainicjuj axe-scan i ustaw wersję językową (lokalizację) 

Ustaw axe-scan w swoim katalogu roboczym:

```
axe-scan init
```

Jeśli chcesz zmienić język wyników axe-scan:

```
axe-scan config --change-value locale=ja
```

Powyższy przykład ustawia locale na `ja` lub japońskie. Zobacz część [`lokalizacja` w Konfiguracja axe-scan](#locale), aby uzyskać więcej szczegółów na temat wartości, które może przyjąć.

### 3. Stwórz plik `urls.txt`

W bieżącym katalogu roboczym utwórz listę adresów URL, na których ma być przeprowadzony test dostępności. Adresy URL powinny być oddzielone końcami wierszy (za;pisane w odrębnych liniach). Nazwij plik `urls.txt`. Więcej szczegółów znajdziesz w sekcji [Uruchom skanowanie](#uruchom-skanowanie).

### 4. Wstępne badanie dostępności

Przeprowadź test wstępny i zapisz wyniki do `results.csv`:

```
axe-scan run > results.csv
```

Wykonanie listy około 1000 stron zajmie około 1 godziny.

### 5. Przegląd wyników, rozwiązywanie problemów i tworzenie listy dopuszczającej

Otwórz plik `results.csv` i sprawdź jego zawartość. Prawdopodobnie zobaczysz, że pod kolumną `Result Types` znajdują się elementy `violations` i `incomplete`.

`Violations` to elementy, które wyraźnie naruszają jedno lub więcej z kryteriów sukcesu WCAG. Zajmij się tymi kwestiami. Zauważ, że może być wiele wierszy dla pojedynczego problemu, jeśli ma więcej niż jeden sposób, aby go rozwiązać. Po prawidłowym rozwiązaniu za pomocą jednej z metod, zestaw elementów zniknie.

`Incomplete` to elementy, których axe-core nie mógł jednoznacznie określić, czy jest to naruszenie czy nie. Sprawdź element ręcznie i określ, czy jest to naruszenie, czy nie. Jeśli nie znaleziono żadnych problemów, oflaguj wiersz, aby włączyć go do listy dopuszczającej (`allowlist`) do przyszłego użytku.

Utwórz `allowlist.csv` poprzez filtrowanie `results.csv` dla elementów, które zostały tak oznaczone. Dołącz pierwszy wiersz, tj. wiersz nagłówka, kiedy zapisujesz `allowlist.csv` jako nowy plik.



### 6. Badanie dostępności: drugi etap

Wykonaj drugi przebieg testu dostępności, tym razem biorąc pod uwagę zawartość `allowlist.csv`:

```
axe-scan run --allowlist allowlist.csv > results-allowlisted.csv
```

Sprawdź utworzony plik CSV `results-allowlisted.csv` i zobacz, że nie ma pozycji w pliku `allowlist.csv` (_and see that items in the `allowlist.csv` are not present_). W rzeczywistości, jeśli rozwiązałeś naruszenia w poprzednim kroku, ten plik CSV powinien być pusty.

### 7. Utwórz raport podsumowujący

Aby utworzyć raport zbiorczy na podstawie kryteriów sukcesu WCAG, należy uruchomić:

```
axe-scan summary --allowlist allowlist.csv > summary-allowlisted.csv
```

Po wykonaniu poprzednich kroków wszystkie przedmioty powinny mieć status PASS lub INAPLICABLE.

### 8. Udostępnij pliki swojemu zespołowi

- `results-allowlisted.csv`
- `allowlist.csv`
- `summary-allowlisted.csv`

Możesz użyć `allowlist.csv` do okresowych testów dostępności stron internetowych używając axe-scan, aby łatwo wykryć nowe  pozycje `violations` i `incomplete`.

### 9. Zastosowanie z testami ręcznymi

Axe-scan nie jest uniwersalnym testem dostępności. Istnieją pewne kryteria sukcesu WCAG (SC), których axe-scan nie może sprawdzić, więc aby stworzyć pełną listę kontrolną wszystkich kryteriów WCAG, będziesz musiał użyć axe-scan wraz z innymi środkami, takimi jak ręczne przeglądy lub testy przy użyciu innych specjalistycznych narzędzi.

## Instalacja

### Wymagania wstępne: Node.js

Aby zainstalować axe-scan, musisz mieć zainstalowany Node.js jako warunek wstępny. Aby sprawdzić, wprowadź na swoim Terminalu, Powershell, Command Prompt lub preferowanym kliencie:

```
node -v
```

Jeśli zwróci to błąd, [zainstaluj najnowszą wersję LTS Node.js](https://nodejs.org/), zanim przejdziesz poniżej. Ten dokument nie będzie wchodził w szczegóły, ale istnieją sposoby, aby ułatwić zarządzanie wersjami Node.js dla użytkowników macOS i Linux:

- [Homebrew — The Missing Package Manager for macOS (or Linux)](https://brew.sh/index)
- [hokaccha/nodebrew: Node.js version manager](https://github.com/hokaccha/nodebrew)

### Zainstaluj axe-scan

Na swoim Terminalu wpisz:

```
npm install -g axe-scan
```

To instaluje axe-scan globalnie, tzn. wszystkie wykonania uruchomione na twoim koncie będą używać tej samej wersji axe-scan.

Jeśli chcesz rozdzielić wersje w zależności od katalogu roboczego, zainstaluj axe-scan lokalnie bez opcji `-g`:

```
npm install axe-scan
```

Jeśli chcesz zainstalować konkretną wersję axe-scan, dodaj numer wersji do nazwy pakietu:

```
npm install axe-scan@1.0.0
```

### Aktualizacja pakietu 

Aby zaktualizować zainstalowany axe-scan:

```
npm update -g axe-scan
```

Usuń opcję `-g` jak w sekcji [Zainstaluj axe-scan](#zainstaluj-axe-scan), w zależności od potrzeb.

## Stosowanie

### Zainicjuj

```
axe-scan init [opcje]
```

Utwórz plik `axe-scan.config.json` w katalogu roboczym z wartościami domyślnymi. Jeśli plik konfiguracyjny już istnieje w katalogu, pojawi się pytanie, czy zaktualizować plik czy przerwać. Jeśli umieściłeś plik konfiguracyjny w swoim katalogu domowym `~/axe-scan.config.json`, `axe-scan init` skopiuje to ustawienie zamiast wartości domyślnych.

Użyj opcji `--global` aby utworzyć plik konfiguracyjny w katalogu domowym, a nie w bieżącym katalogu roboczym:

```
axe-scan init --global
```

#### Opcje

- `-g`, `--global`: Utworzyć plik konfiguracyjny w katalogu domowym (głównym).

#### Ustawienia domyślne

```json
{
  "axeCoreTags": ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
  "resultTypes": ["incomplete", "violations"],
  "filePath": "./urls.txt",
  "locale": "en"
}
```

Zobacz część [Konfiguracja axe-scan](#konfiguracja-axe-scan), aby uzyskać więcej szczegółów. Ustawienia użytkownika zostaną zastosowane w następującej kolejności: (1) plik `./axe-scan.config.json` w katalogu roboczym, (2) plik `~/axe-scan.config.json` w katalogu domowym użytkownika, i (3) ustawienia domyślne.

### Skonfiguruj

```
axe-scan config [opcje]
```

> Ta część dotyczy stosowania polecenia `config`. Zobacz część [Konfiguracja axe-scan](#konfiguracja-axe-scan), aby uzyskać więcej szczegółów na temat odpowiednich elementów konfiguracji.

Sprawdź poprawność ustawień axe-scan. Użyty z opcją `--change-value`, zmodyfikuje ustawienie axe-scan do lokalnego pliku `./axe-scan.config.json`. Zwraca błąd jeśli lokalny `axe-scan.config.json` nie istnieje i zachęca użytkownika do uruchomienia najpierw `axe-scan init`. <!--Przywraca kolejny błąd, jeśli wskazany klucz/wartość nie pasuje do predefiniowanych zestawów klucz/wartość.-->.

Aby przypisać wiele wartości do klucza, połącz wartości przecinkiem:

```
axe-scan config -V resultTypes=incomplete,violations,passes
```

#### Opcje

- `-V`, `--change-value <klucz>=<wartosc>`: Modyfikuje wartość wskazanego elementu kluczowego w pliku konfiguracyjnym.
- `-g`, `--global`: Edytuj plik konfiguracyjny w katalogu domowym zamiast w katalogu bieżącym. Użyj z opcją `--change-value`.

### Uruchom skanowanie

```
axe-scan run [opcje]
```

Uruchom test dostępności. Domyślnie axe-scan szuka pliku `urls.txt` w bieżącym katalogu użytkownika i przeprowadza testy dostępności dla adresów URL wymienionych w tym pliku. Zawartość pliku tekstowego powinna wyglądać tak jak poniżej, gdzie docelowe adresy URL stron internetowych są oddzielone przerwami w linii. Kodowanie tekstu powinno być w UTF-8.

```
https://www.strona-do-testowania.com/
https://www.strona-do-testowania/podstrona/
https://www.strona-do-testowania/kolejna podstrona/
```

Możesz chcieć zobaczyć również sekcję [stron z podstawowym uwierzytelnianiem](#testowanie-stron-z-podstawowym-uwierzytelnianiem).

Axe-scan wypisuje listę wyników testów strona po stronie, element po elemencie, gdzie typem wyniku jest `violation` lub `incomplete`. Zobacz [dokumentacja axe-core](https://www.deque.com/axe/core-documentation/api-documentation/#results-object), aby poznać ich definicje. To, który typ wyniku ma być wyświetlany w raporcie, może być zmienione poprzez edycję pliku konfiguracyjnego `axe-scan.config.json`:


```jsonc
{
  "resultTypes": ["incomplete", "violations"] // Pominięte w ustawieniach domyślnych są "passes" i "inapplicable"
}
```

Aby utworzyć wyjściowy plik CSV:

```
axe-scan run > axe-results.csv
```

Zwraca błąd, jeśli nie znaleziono `urls.txt`. Opcjonalnie możesz wyznaczyć własną ścieżkę dla listy adresów URL używając opcji `--file`. Podobnie, opcjonalnie można wyznaczyć ścieżkę do pliku `allowlist` używając flagi `--allowlist`. Pasujące wpisy zostaną wykluczone z wyjścia:

```
axe-scan run --file urls-list.txt --allowlist /sciezka/do/allowlisted-alerts.csv > result-allowlisted.csv
```

Szczegóły na temat używania allowlist, zobacz sekcję [Definiuj allowlist](#definiuj-allowlist).

#### Opcje

- `-F`, `--file <urlsFilePath>`: Wyznacz ścieżkę pliku dla listy adresów URL, na których ma być przeprowadzony test dostępności.
- `-A`, `--allowlist <allowlistFilePath>`: Wyznacz ścieżkę pliku dla listy alertów dostępności.

### Tworzenie raportu podsumowującego

```
axe-scan summary [opcje]
```

Utwórz podsumowany raport dostępności stron internetowych pogrupowanych według kryteriów sukcesu WCAG. Jeśli ustawiona jest opcja `--page`, raport będzie generowany dla każdej strony.

Możesz także zobaczyć sekcję [Testowanie stron z podstawowym uwierzytelnianiem](#testowanie-stron-z-podstawowym-uwierzytelnianiem).

#### Opcje

- `-F`, `--file <urlsFilePath>`: Wyznacz ścieżkę pliku dla listy adresów URL, na których ma być przeprowadzony test dostępności.
- `-P`, `--page`: Utwórz raport podsumowujący na podstawie każdej strony.
- `-A`, `--allowlist <allowlistFilePath>`: Wyznacz ścieżkę pliku dla listy alertów dostępności.

### Definiuj allowlist

Wyniki `axe-scan run` będą prawdopodobnie zawierać elementy, których typ wyniku to `incomplete`, co odnosi się do elementów HTML, które wymagają dalszych testów i ręcznego sprawdzenia. Jeśli po dalszych testach zdecydujesz się uznać element za `passes` (= nie znaleziono problemu z dostępnością), możesz dodać go do allowlist (listy dopuszczającej).

Plik `allowlist.csv` jest w zasadzie podzbiorem pliku `results.csv` utworzonego przez:

```
axe-scan run > results.csv
```

Przefiltruj wiersze, które chcesz dodać do allowlist i zapisz je jako kolejny plik CSV, np. `allowlist.csv`. Upewnij się, że skopiowałeś do allowlisty również pierwszy rząd, tj. rząd nagłówka.

Możesz następnie uruchomić kolejne testy dostępności używając opcji `--allowlist <allowlistFilePath>`, aby odfiltrować elementy wymienione w allowlist z wyników axe-scan:

```
axe-scan run --allowlist allowlist.csv > results-allowlisted.csv
axe-scan summary -A allowlist.csv > summary.csv
```

## Konfiguracja axe-scan

### `axeCoreTags`

Znaczniki axe-core definiują zestaw wymagań, na których powinien być przeprowadzony test dostępności. Na przykład, jeśli chcesz przetestować wymagania odnoszące się do WCAG 2.1 Poziom AA, powinieneś dołączyć tag `wcag21aa`. Możesz również wyznaczyć konkretne kryterium sukcesu WCAG jak `wcag111`, które wskazuje na kryterium sukcesu 1.1.1. Zobacz [oficjalną dokumentację na temat tagów axe-core](https://www.deque.com/axe/core-documentation/api-documentation/#user-content-axe-core-tags), aby uzyskać więcej szczegółów i możliwych wartości, które może przyjąć.


#### Wartości domyślne

`["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]`

### `resultTypes`

Typy wyników axe, które powinny być wyprowadzone na komendę `axe-scan run`. Oryginalne wyniki axe są pogrupowane zgodnie z ich wynikiem w następujące grupy tablic: `passes` (te wyniki wskazują, jakie elementy spełniły wymagania), `violations` (te wyniki wskazują, jakie elementy nie spełniły wymagań), `inapplicable` (te wyniki wskazują, jakie wymagania nie zostały uruchomione, ponieważ nie znaleziono pasującej treści na stronie. Na przykład, bez wideo, te wymagania nie zostaną uruchomione), i `incomplete` (wykonywanie tych testów zostało przerwane, bo wymagane są dalsze testy. Może się to zdarzyć z powodu ograniczeń technicznych dotyczących tego, co dana reguła może testować, lub dlatego, że wystąpił błąd javascript.). Zobacz [oficjalną dokumentację na temat opcji axe-core](https://www.deque.com/axe/core-documentation/api-documentation/#options-parameter), aby uzyskać więcej szczegółów.

#### Wartości domyślne

`["incomplete", "violations"]`

### `filePath`

Ścieżka do pliku z listą adresów URL, na których ma być testowana dostępność. Na przykład, jeśli chcesz aby axe-scan odwoływał się do `target-urls.txt` w podkatalogu o nazwie `data` w Twoim macOS, ustawisz tę wartość na `./data/target-urls.txt`.

#### Wartości domyślne

`./urls.txt`

### `locale`

Język wyjścia axe i komunikatów axe-scan. Sprawdź [dequelabs/axe-core](https://github.com/dequelabs/axe-core#supported-locales), aby poznać pełną listę obsługiwanych lokalizacji w axe. Z wyjątkiem `en` (angielski; wartość domyślna), kod języka powinien odpowiadać nazwom plików JSON dostępnych w folderze [locales w axe-core](https://github.com/dequelabs/axe-core/tree/develop/locales), np. `de` (niemiecki) z `de.json` i `pt_BR` (portugalski (brazylijski)) z `pt_BR.json`. Zauważ, że wiadomości axe-scan są utrzymywane oddzielnie w [`./src/messages.ts` tego repozytorium](https://github.com/irdpl/axe-scan/blob/main/src/messages.ts)


#### Wartości domyślne

`en`

## Testowanie stron z podstawowym uwierzytelnianiem

Podczas testowania stron z podstawowym uwierzytelnianiem, dołącz informację auth do listy adresów URL w następującym formacie:

```
https://userid:password@example.com/
```

Na przykład, jeśli testujesz na następujących stronach:

```
https://mojawitryna.com/
https://mywebsite.com/podstrona1/
https://mywebsite.com/podstrona2/
```

z podstawowym uwierzytelnieniem ID: `myAccountId` i hasłem: `qwerty`, twoje `urls.txt` powinno wyglądać tak:

```
https://myAccountId:qwerty@mojawitryna.com/
https://myAccountId:qwerty@mojawitryna.com/podstrona1/
https://myAccountId:qwerty@mojawitryna.com/podstrona2/
```

## Podziękowania

Choć zakodowane od podstaw, narzędzie to zostało w znacznym stopniu zainspirowane pracami [luis-reed/axe-reports](https://github.com/louis-reed/axe-reports) i [caztcha/axe-test](https://github.com/caztcha/axe-test). Oba wykorzystały wyniki axe-core do stworzenia CSV lub arkusza kalkulacyjnego z problemami dostępności.
