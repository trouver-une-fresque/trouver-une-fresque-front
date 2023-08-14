import {Workshop, WorkshopsAvecDistanceParDepartement} from "./State";

const PAGINATION_SIZE = 20;

export class InfiniteScroll {

    ajouterCartesPaginees(workshopsParDepartementAffiches: WorkshopsAvecDistanceParDepartement | undefined = undefined,
                          cartesAffichees: Workshop[]) {

        if (!workshopsParDepartementAffiches?.workshopsMatchantCriteres ||
            cartesAffichees.length >= workshopsParDepartementAffiches?.workshopsMatchantCriteres.length) {

            return cartesAffichees;
        }

        const startIndex = cartesAffichees.length
        let cartesAAjouter = workshopsParDepartementAffiches.workshopsMatchantCriteres
            .slice(startIndex, startIndex + PAGINATION_SIZE);

        return cartesAffichees.concat(cartesAAjouter);
    }
}
