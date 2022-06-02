import { Movie } from "../entity/Movie";
import { Arg, Field, InputType, Int, Mutation, Query, Resolver } from "type-graphql";

@InputType()
class MovieInput {
  @Field()
  title: string;

  @Field(() => Int)
  minutes: number;
}

@Resolver()
export class MovieResolver {
  @Mutation(() => Movie)
  async createMovie(@Arg('options', () => MovieInput) options:MovieInput) {
    return await Movie.create(options).save();
  }

  @Mutation(() => Boolean)
  async updateMovie(@Arg('id', () => Int) id:number, @Arg('input', () => MovieInput) input:MovieInput) {
    await Movie.update({ id }, input);
    return true
  }

  @Mutation(() => Boolean)
  async deleteMovie(@Arg('id', () => Int) id:number) {
    await Movie.delete(id);
    return true
  }


  @Query(() => [Movie])
  async getMovies() {
      return await Movie.find()
  }
}
